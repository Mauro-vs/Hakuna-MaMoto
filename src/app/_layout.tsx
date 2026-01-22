import { useEffect, useMemo } from 'react';
import { Stack } from 'expo-router';
import { usePreferencesStore, useThemeColors } from '../store/preferencesStore';

export default function RootLayout() {
  const cargarTema = usePreferencesStore((state) => state.cargarTema);
  const colors = useThemeColors();
  const screenOptions = useMemo(() => ({
    headerShown: false,
    contentStyle: { backgroundColor: colors.backgroundMain },
  }), [colors]);

  useEffect(() => {
    cargarTema();
  }, [cargarTema]);

  return (
    <Stack
      screenOptions={screenOptions}
    />
  );
}