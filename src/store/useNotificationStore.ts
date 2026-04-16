import { create } from 'zustand';
import type { Notification } from '../types';
import { api } from '../services/api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const data = await api.getNotifications();
      set({
        notifications: data,
        unreadCount: data.filter(n => !n.read).length,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: (id: string) => {
    set((state) => {
      const updated = state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        // Bug Category 2: State management - Derived state inconsistency
        // unreadCount is computed from the OLD notifications, not the newly updated ones
        unreadCount: state.notifications.filter(n => !n.read).length,
      };
    });
  },
}));
