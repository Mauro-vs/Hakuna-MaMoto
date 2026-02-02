import { useMemo } from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StatusBar } from "react-native";
import { useThemeColors } from "../../store/preferencesStore";
import { useAuth } from "../../context/AuthContext";
import { useUserStore } from "../../store/userStore";

export default function HomeLayout() {
  const ICON_SIZE = 30; 
  const colors = useThemeColors();
  const { isSignedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);
  const isCliente = user?.rol === 'NORMAL';

  const screenOptions = useMemo(() => ({
    headerStyle: { backgroundColor: colors.primaryHeader },
    headerTintColor: colors.headerText,
    headerTitleAlign: "center" as const,
    headerShadowVisible: false,

    tabBarStyle: {
      backgroundColor: colors.tabBackground,
      height: 90,
      borderTopWidth: 0,
    },
    tabBarItemStyle: {
      paddingTop: 15,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
    tabBarLabelStyle: {
      display: "none" as const,
    },
    tabBarActiveTintColor: colors.tabActive,
    tabBarInactiveTintColor: colors.tabInactive,
  }), [colors]);

  if (isLoading) return null;
  if (!isSignedIn) return <Redirect href="/(login)/Login" />;

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primaryHeader}
      />
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

      {/* CLIENTES - Solo visible para admin y empleado */}
      <Tabs.Screen
        name="clientes/index"
        options={{
          title: "Clientes",
          href: isCliente ? null : undefined,
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
        name="profile/profile"
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
      <Tabs.Screen name="profile/edit-profile" options={{ href: null }} />
    </Tabs>
    </>
  );
}
