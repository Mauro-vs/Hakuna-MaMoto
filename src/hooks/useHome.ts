import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/userStore';
import { supabase } from '../services/supabaseClient';


type UserRole = 'ADMIN' | 'MECANICO' | 'NORMAL' | null | undefined;

const getUserInitial = (name?: string | null): string =>
  (name?.[0] ?? 'U').toUpperCase();

const getUserRoleLabel = (rol: UserRole): string => {
  if (rol === 'ADMIN') return 'ADMIN';
  if (rol === 'MECANICO') return 'MECANICO';
  if (rol === 'NORMAL') return 'CLIENTE';
  return 'USUARIO';
};

const getUserRoleIconName = (rol: UserRole): string => {
  if (rol === 'ADMIN') return 'shield-checkmark';
  if (rol === 'MECANICO') return 'briefcase';
  return 'person';
};

interface UseHomeResult {
  userName: string;
  userInitial: string;
  userAvatarUrl: string | null;
  userRole: UserRole;
  userRoleLabel: string;
  userRoleIconName: string;
  reservationsCount: number | null;
  handleExploreModels: () => void;
  handleViewReservations: () => void;
  handleViewFavorites: () => void;
}

/**
 * Lógica de la pantalla Home: usuario, reservas y navegación principal.
 */
export const useHome = (): UseHomeResult => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [reservationsCount, setReservationsCount] = useState<number | null>(null);

  const userRole = user?.rol as UserRole;
  const userName = user?.nombre ?? 'Usuario';
  const userInitial = getUserInitial(user?.nombre);
  const userAvatarUrl = user?.avatarUrl ?? null;
  const userRoleLabel = getUserRoleLabel(userRole);
  const userRoleIconName = getUserRoleIconName(userRole);

  const loadReservationsCount = useCallback(async () => {
    if (!user?.id) {
      setReservationsCount(null);
      return;
    }

    const { count, error } = await supabase
      .from('reservas')
      .select('id', { count: 'exact', head: true })
      .eq('usuario_id', user.id);

    if (error) {
      console.warn('No se pudo cargar el numero de pedidos', error);
      setReservationsCount(0);
      return;
    }

    setReservationsCount(count ?? 0);
  }, [user?.id]);

  useEffect(() => {
    void loadReservationsCount();
  }, [loadReservationsCount]);

  useFocusEffect(
    useCallback(() => {
      void loadReservationsCount();
    }, [loadReservationsCount])
  );

  const handleExploreModels = () => {
    router.push('/modelos');
  };

  const handleViewReservations = () => {
    router.push('/reservas');
  };

  const handleViewFavorites = () => {
    router.push('/modelos/favoritos');
  };

  return {
    userName,
    userInitial,
    userAvatarUrl,
    userRole,
    userRoleLabel,
    userRoleIconName,
    reservationsCount,
    handleExploreModels,
    handleViewReservations,
    handleViewFavorites,
  };
};