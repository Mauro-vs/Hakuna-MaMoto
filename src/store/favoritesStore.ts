import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { useUserStore } from "./userStore";

const BASE_FAVORITES_KEY = "userFavorites";

const getKeyForCurrentUser = () => {
  const userId = useUserStore.getState().user?.id;
  if (!userId) return null;
  return `${BASE_FAVORITES_KEY}:${userId}`;
};

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],

  // Función para añadir o quitar una moto de favoritos
  toggleFavorite: async (id) => {
    const storageKey = getKeyForCurrentUser();
    if (!storageKey) {
      console.warn("toggleFavorite llamado sin usuario autenticado");
      return;
    }

    const currentFavorites = get().favoriteIds;
    let newFavorites;

    // Si ya es favorito, lo quitamos. Si no, lo añadimos.
    if (currentFavorites.includes(id)) {
      newFavorites = currentFavorites.filter((favId) => favId !== id);
    } else {
      newFavorites = [...currentFavorites, id];
    }

    // Actualizamos el estado y lo guardamos en el almacenamiento local
    set({ favoriteIds: newFavorites });
    await AsyncStorage.setItem(storageKey, JSON.stringify(newFavorites));
  },

  // Función para cargar los favoritos guardados al abrir la app
  loadFavorites: async () => {
    try {
      const storageKey = getKeyForCurrentUser();
      if (!storageKey) {
        set({ favoriteIds: [] });
        return;
      }

      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        set({ favoriteIds: JSON.parse(saved) });
      } else {
        set({ favoriteIds: [] });
      }
    } catch (error) {
      console.error("Error al cargar favoritos", error);
    }
  },
}));
