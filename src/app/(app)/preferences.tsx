import React, { useMemo, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  usePreferencesStore,
  useThemeColors,
  ThemeOption,
} from "../../store/preferencesStore";
import { mainThemeColors } from "../../theme";
import { Feather } from "@expo/vector-icons";

export default function Preferences() {
  const router = useRouter();
  const { tema, setTema, cargarTema } = usePreferencesStore();
  const colors = useThemeColors();

  useEffect(() => {
    cargarTema();
  }, [cargarTema]);

  const themeOptions: {
    value: ThemeOption;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      value: "light",
      label: "Claro",
      icon: "○",
      description: "Modo claro para el día",
    },
    {
      value: "dark",
      label: "Oscuro",
      icon: "●",
      description: "Modo oscuro para la noche",
    },
  ];

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Preferencias`,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={{ padding: 12 }}
            >
              <Feather
                name="chevron-left"
                size={25}
                color={colors.headerText}
              />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: colors.headerBackground },
          headerTitleStyle: {
            color: colors.headerText,
            fontSize: 18,
            fontWeight: "600",
          },
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Sección Apariencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APARIENCIA</Text>
          <View style={styles.card}>
            {themeOptions.map((option, index) => (
              <View key={option.value}>
                <Pressable
                  style={({ pressed }) => [
                    styles.optionRow,
                    tema === option.value && styles.optionRowSelected,
                    pressed && styles.optionRowPressed,
                  ]}
                  onPress={() => setTema(option.value)}
                >
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        tema === option.value && styles.iconContainerSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionIcon,
                          tema === option.value && styles.optionIconSelected,
                        ]}
                      >
                        {option.icon}
                      </Text>
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.optionText,
                          tema === option.value && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  {tema === option.value && (
                    <View style={styles.checkmarkContainer}>
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </Pressable>
                {index < themeOptions.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
          <Text
            style={{
              fontSize: 13,
              color: colors.grayPlaceholder,
              marginTop: 10,
              marginLeft: 4,
              marginRight: 4,
              marginBottom: 20,
              lineHeight: 18,
            }}
          >
            Los cambios se aplican inmediatamente en toda la aplicación
          </Text>
        </View>

        {/* Sección Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versión</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Compilación</Text>
              <Text style={styles.infoValue}>2026.01</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Desarrollador</Text>
              <Text style={styles.infoValue}>Hakuna MaMoto Team</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View
          style={{
            paddingVertical: 40,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: colors.grayPlaceholder,
              fontWeight: "600",
            }}
          >
            © 2026 Hakuna MaMoto Project
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.grayPlaceholder,
              marginTop: 4,
            }}
          >
            Todos los derechos reservados
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: typeof mainThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundMain,
    },
    content: {
      flex: 1,
    },
    section: {
      marginTop: 32,
      marginHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.grayLabelText,
      marginBottom: 12,
      marginLeft: 4,
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.backgroundCard,
    },
    optionRowSelected: {
      backgroundColor: colors.backgroundInput,
    },
    optionRowPressed: {
      opacity: 0.6,
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.backgroundInput,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.borderLight,
    },
    iconContainerSelected: {
      backgroundColor: colors.primaryButton,
      borderColor: colors.primaryButton,
    },
    optionIcon: {
      fontSize: 22,
      color: colors.grayLabelText,
    },
    optionIconSelected: {
      color: "#ffffff",
    },
    textContainer: {
      flex: 1,
    },
    optionText: {
      fontSize: 17,
      fontWeight: "600",
      color: colors.textBody,
      letterSpacing: 0.2,
      marginBottom: 2,
    },
    optionTextSelected: {
      color: colors.primaryButton,
      fontWeight: "700",
    },
    optionDescription: {
      fontSize: 13,
      color: colors.grayPlaceholder,
      letterSpacing: 0.1,
    },
    checkmarkContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primaryButton,
      justifyContent: "center",
      alignItems: "center",
    },
    checkmark: {
      fontSize: 14,
      color: "#ffffff",
      fontWeight: "800",
    },
    separator: {
      height: 0.5,
      backgroundColor: colors.borderLight,
      marginLeft: 12,
      marginRight: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    infoLabel: {
      fontSize: 17,
      fontWeight: "500",
      color: colors.textBody,
    },
    infoValue: {
      fontSize: 17,
      color: colors.grayLabelText,
    },
  });
