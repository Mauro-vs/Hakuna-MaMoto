import { useEffect, useMemo } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePreferencesStore, useThemeColors } from '../store/preferencesStore';
import { AuthProvider } from '../context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack
          screenOptions={screenOptions}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}