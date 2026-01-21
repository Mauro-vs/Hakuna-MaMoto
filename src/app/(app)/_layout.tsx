import { Feather } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { mainThemeColors } from "../../theme";
import { TouchableOpacity } from "react-native";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: mainThemeColors.primaryHeader, height: 100 },
        headerTintColor: mainThemeColors.headerText,
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/clientes")}
            style={{
              marginRight: 15,
              backgroundColor: mainThemeColors.avatarBackground,
              padding: 10,
              borderRadius: 25,
            }}>
            <Feather
              name="user"
              size={24}
              color={mainThemeColors.avatarText}
            />
            </TouchableOpacity>
        ),

        tabBarStyle: { backgroundColor: mainThemeColors.tabBackground },
        tabBarActiveTintColor: mainThemeColors.tabActive,
        tabBarInactiveTintColor: mainThemeColors.tabInactive,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="clientes/index"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="clientes/[id]" options={{ href: null }} />
    </Tabs>
  );
}
