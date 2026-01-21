import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { mainThemeColors } from '../../theme';

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: mainThemeColors.primaryHeader },
        headerTintColor: mainThemeColors.headerText,
        
        tabBarStyle: { backgroundColor: mainThemeColors.tabBackground},
        tabBarActiveTintColor: mainThemeColors.tabActive,
        tabBarInactiveTintColor: mainThemeColors.tabInactive,
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