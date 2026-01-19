import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // headerStyle: {
        //   backgroundColor: '#0f172a'
        // },
        // headerTintColor: '#ffffff',
        // title: 'Renting App',
      }}
    />
  );
}