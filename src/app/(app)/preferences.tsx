import React, { useMemo } from "react";
import { View, Text, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useThemeColors } from "../../store/preferencesStore";
import { Feather } from "@expo/vector-icons";
import { createPreferencesStyles } from "../../style/preferences.styles";
import { usePreferencesScreen } from "../../useControllers/usePreferencesScreen";

export default function Preferences() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createPreferencesStyles(colors), [colors]);
  const { tema, setTema, themeOptions } = usePreferencesScreen();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Preferencias`,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/profile/profile")}
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
