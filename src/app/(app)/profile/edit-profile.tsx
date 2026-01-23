import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../../store/preferencesStore";
import { useUserStore } from "../../../store/userStore";

export default function EditProfile() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useUserStore((state) => state.user);
  const updateNombre = useUserStore((state) => state.updateNombre);
  const [nombre, setNombre] = useState(user?.nombre ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    setIsSaving(true);
    try {
      // Simular un pequeño delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateNombre(nombre.trim());
      
      // Obtener el usuario actualizado del store
      const updatedUser = useUserStore.getState().user;
      
      Alert.alert("Éxito", "Nombre actualizado correctamente", [
        {
          text: "OK",
          onPress: () => router.replace("/profile/profile"),
        },
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
    >
      <Stack.Screen
        options={{
          title: "Editar Perfil",
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
        }}
      />
      {/* Separador */}
      <View style={{ height: 18 }} />

      {/* Info actual */}
      <View style={styles.userInfoCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {(nombre?.[0] ?? "U").toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{nombre || "Usuario"}</Text>
        <Text style={styles.userEmail}>
          {user?.email ?? "usuario@example.com"}
        </Text>
      </View>

      {/* Formulario de edición */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre visible</Text>
          <Text style={styles.hint}>
            Este es el nombre que será visible en la aplicación
          </Text>
          <TextInput
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ingresa tu nombre"
            style={[
              styles.input,
              { borderColor: colors.borderMain, color: colors.textBody },
            ]}
            placeholderTextColor={colors.grayPlaceholder}
            editable={!isSaving}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            isSaving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Ionicons name="hourglass" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Guardando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
          onPress={() => router.replace("/profile/profile")}
          disabled={isSaving}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    screen: {
      backgroundColor: colors.backgroundMain,
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    userInfoCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      paddingVertical: 24,
      paddingHorizontal: 20,
      alignItems: "center",
      marginBottom: 28,
      borderWidth: 1,
      borderColor: colors.borderMain,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    avatarContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.primaryButton,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 14,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: "800",
      color: "#fff",
    },
    userName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 13,
      color: colors.textBody,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.grayPlaceholder,
      marginBottom: 16,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    formGroup: {
      marginBottom: 18,
    },
    label: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 6,
    },
    hint: {
      fontSize: 12,
      color: colors.grayPlaceholder,
      marginBottom: 8,
      fontWeight: "500",
    },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.textBody,
      fontSize: 14,
      backgroundColor: colors.backgroundCard,
    },
    disabledInput: {
      justifyContent: "center",
      backgroundColor: colors.tabBackground,
      borderColor: colors.borderMain,
    },
    disabledText: {
      color: colors.grayPlaceholder,
      fontWeight: "500",
    },
    saveButton: {
      backgroundColor: colors.primaryButton,
      paddingVertical: 14,
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
      shadowColor: colors.primaryButton,
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 4,
    },
    saveButtonPressed: {
      opacity: 0.85,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
    cancelButton: {
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.borderMain,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelButtonPressed: {
      backgroundColor: colors.tabBackground,
    },
    cancelButtonText: {
      color: colors.textTitle,
      fontSize: 14,
      fontWeight: "700",
    },
    infoBox: {
      flexDirection: "row",
      backgroundColor: colors.backgroundCard,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.borderMain,
      gap: 10,
      marginTop: 16,
      alignItems: "flex-start",
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: colors.textBody,
      fontWeight: "500",
      lineHeight: 18,
    },
  });
