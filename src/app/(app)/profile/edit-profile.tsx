import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "../../../store/preferencesStore";
import { createEditProfileStyles } from "../../../style/editProfile.styles";
import { useEditProfileScreen } from "../../../hooks/useEditProfileScreen";

export default function EditProfile() {
  const colors = useThemeColors();
  const styles = useMemo(() => createEditProfileStyles(colors), [colors]);
  const {
    nombre,
    email,
    avatarUrl,
    isUploadingAvatar,
    isSaving,
    setNombre,
    setEmail,
    handlePickAvatar,
    handleSave,
    router,
  } = useEditProfileScreen();

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
        <Pressable
          style={({ pressed }) => [
            styles.avatarContainer,
            pressed && styles.avatarContainerPressed,
            (isUploadingAvatar || isSaving) && styles.avatarContainerDisabled,
          ]}
          onPress={handlePickAvatar}
          disabled={isUploadingAvatar || isSaving}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {(nombre?.[0] ?? "U").toUpperCase()}
            </Text>
          )}
          <View style={styles.avatarBadge}>
            <Feather name="camera" size={14} color="#fff" />
          </View>
        </Pressable>
        <Text style={styles.avatarHint}>
          {isUploadingAvatar ? "Subiendo..." : "Toca para cambiar tu avatar"}
        </Text>
        <Text style={styles.userName}>{nombre || "Usuario"}</Text>
        <Text style={styles.userEmail}>{email || "usuario@example.com"}</Text>
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <Text style={styles.hint}>
            Este es el correo que se usa para comunicarte y acceder
          </Text>
          <View
            style={[
              styles.input,
              styles.disabledInput,
              { borderColor: colors.borderMain },
            ]}
          >
            <Text
              style={{
                color: colors.grayPlaceholder,
                fontWeight: "500",
              }}
            >
              {email || "usuario@example.com"}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            (isSaving || isUploadingAvatar) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSaving || isUploadingAvatar}
        >
          <Ionicons name="save-outline" size={18} color="#fff" />
          <Text style={styles.saveButtonText}>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Text>
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
