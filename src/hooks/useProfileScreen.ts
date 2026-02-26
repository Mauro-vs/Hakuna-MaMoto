import { useMemo } from "react";
import { useRouter } from "expo-router";
import { useThemeColors } from "../store/preferencesStore";
import { useUserStore } from "../store/userStore";
import { useAuth } from "../context/AuthContext";

export const useProfileScreen = () => {
  const router = useRouter();
  const colors = useThemeColors();
  const user = useUserStore((state) => state.user);
  const { logout } = useAuth();

  const stylesDepsColors = colors; // para dejar claro el memo externo

  const handleLogout = async () => {
    await logout();
    router.replace("/(login)/Login");
  };

  return {
    colors: stylesDepsColors,
    user,
    handleLogout,
    router,
  };
};
