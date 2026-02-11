import { create } from "zustand";
import { AuthUser } from "../types/types";

interface UserStore {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  updateNombre: (nombre: string) => void;
  updateEmail: (email: string) => void;
  updateRol: (rol: AuthUser["rol"]) => void;
  updateAvatarUrl: (avatarUrl?: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateNombre: (nombre) =>
    set((state) => ({
      user: state.user ? { ...state.user, nombre } : null,
    })),
  updateEmail: (email) =>
    set((state) => ({
      user: state.user ? { ...state.user, email } : null,
    })),
  updateRol: (rol) =>
    set((state) => ({
      user: state.user ? { ...state.user, rol } : null,
    })),
  updateAvatarUrl: (avatarUrl) =>
    set((state) => ({
      user: state.user ? { ...state.user, avatarUrl } : null,
    })),
  clearUser: () => set({ user: null }),
}));
