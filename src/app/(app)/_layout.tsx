import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1f3f8aff' },
        headerTintColor: '#ffffff',
        
        tabBarStyle: { backgroundColor: '#1f3f8aff'},
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#94a3b8',
      }}>

      <Tabs.Screen 
        name="home" 
        options={{ 
            title: 'Inicio',
            tabBarLabel: 'Home',
            tabBarIcon:({color, size}) => (
                <Feather name="home" color={color} size={size} />
            ),
         }} 
      />

      <Tabs.Screen
        name='clientes/index'
        options={{
            title: 'Clientes',
            tabBarIcon:({color, size}) => (
                <Feather name="users" color={color} size={size} />
            ),
         }} 
      />
      <Tabs.Screen
        name="clientes/[id]"
        options={{ href: null }}
        />

    </Tabs>
  );
}