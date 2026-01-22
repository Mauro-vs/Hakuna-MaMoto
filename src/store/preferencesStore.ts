import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { mainThemeColors, mainThemeColorsDark } from "../theme";

export type ThemeOption = "light" | "dark";

const STORAGE_KEY = "userPreferencesTheme";

interface PreferencesState {
  tema: ThemeOption;
  setTema: (tema: ThemeOption) => Promise<void>;
  cargarTema: () => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  tema: "light",
  setTema: async (tema) => {
    await AsyncStorage.setItem(STORAGE_KEY, tema);
    set({ tema });
  },
  cargarTema: async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      set({ tema: saved });
    }
  },
}));

export function useThemeColors() {
  const tema = usePreferencesStore((state) => state.tema);
  return tema === "dark" ? mainThemeColorsDark : mainThemeColors;
}
