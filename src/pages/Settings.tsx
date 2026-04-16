import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { SettingsSection, SettingsRow, ToggleSwitch } from '../components/settings/SettingsSection';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function SettingsPage() {
  const {
    displayName, bio, website,
    notifications, privacy,
    isSaving, isDirty,
    updateProfile, updateNotifications, updatePrivacy, saveSettings,
  } = useSettingsStore();

  const [saved, setSaved] = useState(false);

  // Bug Category 7: Form loses input on re-render
  // Local form state is initialized from store once, but if the store updates
  // (e.g. from another tab or component), the local state doesn't sync.
  // Also: each keystroke calls updateProfile which triggers a store update,
  // causing the entire Settings page to re-render, which re-runs this component
  // but local state is preserved — HOWEVER the Input components re-mount
  // because they're inside conditionally rendered SettingsSection children.
  const [form, setForm] = useState({ displayName, bio, website });

  // Bug Category 1: Missing dependency - `displayName`, `bio`, `website` not in dep array
  // If settings are reset externally, this local form state won't update
  useEffect(() => {
    setForm({ displayName, bio, website });
  }, []);

  const handleSave = async () => {
    updateProfile(form);
    await saveSettings();
    setSaved(true);
    // Bug Category 4: Infinite re-render edge case
    // setTimeout here captures `setSaved` in a closure. If the component unmounts
    // before 2000ms (e.g. user navigates away), this still fires and tries to
    // update state on an unmounted component — React 18 suppresses the warning
    // but the behavior is still a memory leak pattern.
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 md:px-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <SettingsSection title="Profile" description="Update your public profile information.">
        <Input
          label="Display Name"
          value={form.displayName}
          onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
          placeholder="Your name"
        />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => {
              setForm(f => ({ ...f, bio: e.target.value }));
              updateProfile({ bio: e.target.value });
            }}
            rows={3}
            placeholder="Tell people about yourself"
            className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all resize-none placeholder:text-muted-foreground text-sm"
          />
        </div>
        <Input
          label="Website"
          value={form.website}
          onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
          placeholder="https://yoursite.com"
        />
      </SettingsSection>

      <SettingsSection title="Notifications" description="Choose what you want to be notified about.">
        <SettingsRow label="Likes" description="When someone likes your post">
          <ToggleSwitch
            checked={notifications.likes}
            onChange={v => updateNotifications({ likes: v })}
          />
        </SettingsRow>
        <SettingsRow label="Comments" description="When someone comments on your post">
          <ToggleSwitch
            checked={notifications.comments}
            onChange={v => updateNotifications({ comments: v })}
          />
        </SettingsRow>
        <SettingsRow label="New Followers" description="When someone follows you">
          <ToggleSwitch
            checked={notifications.follows}
            onChange={v => updateNotifications({ follows: v })}
          />
        </SettingsRow>
        <SettingsRow label="Email Digest" description="Weekly summary of your activity">
          <ToggleSwitch
            checked={notifications.emailDigest}
            onChange={v => updateNotifications({ emailDigest: v })}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Privacy" description="Control who can see your content.">
        <SettingsRow label="Public Profile" description="Anyone can view your profile">
          <ToggleSwitch
            checked={privacy.publicProfile}
            onChange={v => updatePrivacy({ publicProfile: v })}
          />
        </SettingsRow>
        <SettingsRow label="Show Activity" description="Show when you were last active">
          <ToggleSwitch
            checked={privacy.showActivity}
            onChange={v => updatePrivacy({ showActivity: v })}
          />
        </SettingsRow>
        <SettingsRow label="Allow Tagging" description="Let others tag you in posts">
          <ToggleSwitch
            checked={privacy.allowTagging}
            onChange={v => updatePrivacy({ allowTagging: v })}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Danger Zone" description="Irreversible account actions.">
        <SettingsRow label="Delete Account" description="Permanently delete your account and all data">
          <Button variant="destructive" size="sm">Delete Account</Button>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
