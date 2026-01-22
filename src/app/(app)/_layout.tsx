import { useMemo } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useThemeColors } from "../../store/preferencesStore";

export default function HomeLayout() {
  const ICON_SIZE = 30; 
  const colors = useThemeColors();

  const screenOptions = useMemo(() => ({
    headerStyle: { backgroundColor: colors.primaryHeader },
    headerTintColor: colors.headerText,
    headerTitleAlign: "center" as const,

    tabBarStyle: {
      backgroundColor: colors.tabBackground,
      height: 90,
    },
    tabBarItemStyle: {
      paddingTop: 14,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    tabBarLabelStyle: {
      display: "none" as const,
    },
    tabBarActiveTintColor: colors.tabActive,
    tabBarInactiveTintColor: colors.tabInactive,
  }), [colors]);

  return (
    <Tabs
      screenOptions={screenOptions}
    >
      {/* HOME */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={ICON_SIZE}
              color={color}
            />
          ),
        }}
      />

      {/* CLIENTES */}
      <Tabs.Screen
        name="clientes/index"
        options={{
          title: "Clientes",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={ICON_SIZE}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: focused ? colors.tabActive : 'transparent',
                borderWidth: focused ? 0 : 2,
                borderColor: colors.tabInactive,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="person"
                size={20}
                color={focused ? colors.textInput : colors.tabInactive}
              />
            </View>
          ),
        }}
      />

      {/* RUTA OCULTA */}
      <Tabs.Screen name="clientes/[id]" options={{ href: null }} />
      <Tabs.Screen name="preferences" options={{ href: null }} />
    </Tabs>
  );
}
