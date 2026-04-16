import { create } from 'zustand';

interface NotificationPrefs {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  emailDigest: boolean;
}

interface PrivacyPrefs {
  publicProfile: boolean;
  showActivity: boolean;
  allowTagging: boolean;
}

interface SettingsState {
  displayName: string;
  bio: string;
  website: string;
  notifications: NotificationPrefs;
  privacy: PrivacyPrefs;
  isSaving: boolean;
  isDirty: boolean;
  updateProfile: (fields: Partial<{ displayName: string; bio: string; website: string }>) => void;
  updateNotifications: (prefs: Partial<NotificationPrefs>) => void;
  updatePrivacy: (prefs: Partial<PrivacyPrefs>) => void;
  saveSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  displayName: 'Alice Johnson',
  bio: 'Frontend enthusiast',
  website: 'https://alicej.dev',
  notifications: {
    likes: true,
    comments: true,
    follows: true,
    emailDigest: false,
  },
  privacy: {
    publicProfile: true,
    showActivity: true,
    allowTagging: true,
  },
  isSaving: false,
  isDirty: false,

  updateProfile: (fields) => {
    // Bug Category 2: Global state desync
    // isDirty is set to true here, but the Profile page reads `user` from useAuthStore
    // which is never updated. So the header avatar/name stays stale even after "saving".
    set(state => ({ ...state, ...fields, isDirty: true }));
  },

  updateNotifications: (prefs) => {
    set(state => ({
      notifications: { ...state.notifications, ...prefs },
      isDirty: true,
    }));
  },

  updatePrivacy: (prefs) => {
    set(state => ({
      privacy: { ...state.privacy, ...prefs },
      isDirty: true,
    }));
  },

  saveSettings: async () => {
    set({ isSaving: true });
    await new Promise(r => setTimeout(r, 1200));
    // Bug Category 7: UX - Loading state that never disappears in one edge case
    // If saveSettings is called while isSaving is already true (e.g. double-click),
    // the second call sets isSaving: true again but the first finally block
    // will set it to false, leaving the second call's finally to also set false — 
    // but if an error is thrown between the two, isSaving stays true forever.
    set({ isSaving: false, isDirty: false });
  },
}));
