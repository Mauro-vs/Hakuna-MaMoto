import { create } from "zustand";
import { AuthUser } from "../types/types";

interface UserStore {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  updateNombre: (nombre: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateNombre: (nombre) => set((state) => ({
    user: state.user ? { ...state.user, nombre } : null,
  })),
  clearUser: () => set({ user: null }),
}));
