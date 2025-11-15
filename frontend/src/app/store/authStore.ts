import { create } from "zustand";

export interface User {
  _id: string;
  email: string;
  name?: string;
  credits?: number;
  referralCode?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;

  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setUser: (u) => set({ user: u }),
  setToken: (t) => set({ token: t }),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));
