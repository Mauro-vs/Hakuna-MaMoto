import { useEffect, useMemo } from "react";
import { useModelosList } from "../hooks/useModelos";
import { useFavoritesStore } from "../store/favoritesStore";
import type { Modelo } from "../data/Modelos";

export const useModelosFavoritos = () => {
  const { data, isLoading, isError } = useModelosList();
  const { favoriteIds, loadFavorites } = useFavoritesStore();

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const modelos: Modelo[] = data ?? [];
  const favoritos = useMemo(
    () => modelos.filter((m) => favoriteIds.includes(m.id.toString())),
    [modelos, favoriteIds],
  );

  return {
    isLoading,
    isError,
    favoritos,
  };
};
