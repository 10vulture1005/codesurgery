import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (user) => set((state) => {
    // Bug Category 2: State management -> Mutating state instead of returning new object
    // Depending on when and how this is accessed, it can silently fail to update subscribers or cause partial re-renders
    state.isAuthenticated = true;
    state.user = user;
    return state as any; // Returning the mutated state reference
  }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
