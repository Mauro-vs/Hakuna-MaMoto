import { useMemo } from "react";
import { Tabs, Redirect } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { Image, StatusBar, View } from "react-native";
import { useThemeColors } from "../../store/preferencesStore";
import { useAuth } from "../../context/AuthContext";
import { useUserStore } from "../../store/userStore";

export default function HomeLayout() {
  const ICON_SIZE = 30; 
  const colors = useThemeColors();
  const { isSignedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);
  const isCliente = user?.rol === 'NORMAL';
  const avatarUrl = user?.avatarUrl?.trim();

  const screenOptions = useMemo(() => ({
    headerStyle: { backgroundColor: colors.primaryHeader, height: 90 },
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

      {/* MODELOS */}
      <Tabs.Screen
        name="modelos/index"
        options={{
          title: "Modelos",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "bicycle" : "bicycle-outline"}
              size={ICON_SIZE}
              color={color}
            />
          ),
        }}
      />

      {/* RESERVAS */}
      <Tabs.Screen
        name="reservas/index"
        options={{
          title: "Reservas",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
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
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: focused ? colors.tabActive : colors.tabInactive,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 20,
                  }}
                />
              ) : (
                <Ionicons
                  name="person"
                  size={20}
                  color={focused ? colors.tabActive : colors.tabInactive}
                />
              )}
            </View>
          ),
        }}
      />

      {/* RUTA OCULTA */}
      <Tabs.Screen name="clientes/[id]" options={{ href: null }} />
      <Tabs.Screen name="modelos/[id]" options={{ href: null }} />
      <Tabs.Screen name="preferences" options={{ href: null }} />
      <Tabs.Screen name="profile/edit-profile" options={{ href: null }} />
      <Tabs.Screen name="modelos/favoritos" options={{ href: null }} />
    </Tabs>
    </>
  );
}
