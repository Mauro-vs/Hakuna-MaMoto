import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { useThemeColors } from "../../../store/preferencesStore";
import { useUserStore } from "../../../store/userStore";
import { usuariosService } from "../../../services/usuariosService";
import { supabase } from "../../../services/supabaseClient";
import { UserRole } from "../../../types/types";

export default function EditProfile() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useUserStore((state) => state.user);
  const updateNombre = useUserStore((state) => state.updateNombre);
  const updateEmail = useUserStore((state) => state.updateEmail);
  const updateRol = useUserStore((state) => state.updateRol);
  const updateAvatarUrl = useUserStore((state) => state.updateAvatarUrl);

  const [nombre, setNombre] = useState(user?.nombre ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadAvatar = async () => {
      if (!user?.email) return;
      try {
        const dbUser = await usuariosService.getByEmail(user.email);
        if (mounted && dbUser?.avatarUrl) {
          setAvatarUrl(dbUser.avatarUrl);
          updateAvatarUrl(dbUser.avatarUrl);
        }
      } catch (error) {
        console.warn("No se ha podido cargar el avatar", error);
      }
    };

    void loadAvatar();

    return () => {
      mounted = false;
    };
  }, [user?.email]);

  const uploadAvatar = async (uri: string, userId: string): Promise<string> => {
    const fileExt = (uri.split(".").pop() || "jpg").toLowerCase();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    let fileBuffer: ArrayBuffer;

    if (Platform.OS === "web") {
      const response = await fetch(uri);
      fileBuffer = await response.arrayBuffer();
    } else {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      fileBuffer = decode(base64);
    }

    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      heic: "image/heic",
      heif: "image/heif",
    };
    const contentType = contentTypeMap[fileExt] || "image/jpeg";

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.log(error);
      throw error;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePickAvatar = async () => {
    if (!user?.id) {
      Alert.alert("Error", "No se ha podido obtener el usuario actual");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitamos acceso a tus fotos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        console.log("Selección de imagen cancelada o sin URI");
        return;
      }

      const newUrl = await uploadAvatar(result.assets[0].uri, user.id);
      setAvatarUrl(newUrl);
      updateAvatarUrl(newUrl);

      try {
        await usuariosService.update(user.id, { avatarUrl: newUrl });
      } catch (updateError) {
        console.warn("No se ha podido guardar el avatar", updateError);
        Alert.alert(
          "Aviso",
          "El avatar se subio, pero no se pudo guardar en tu perfil.",
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se ha podido subir el avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    if (!user?.email) {
      Alert.alert(
        "Error",
        "No se ha podido obtener la información del usuario actual",
      );
      return;
    }

    setIsSaving(true);
    try {
      // Simular un pequeño delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Buscar el registro del usuario en la tabla "usuarios" por email
      const dbUser = await usuariosService.getByEmail(user.email);

      if (!dbUser) {
        Alert.alert(
          "Error",
          "No se ha encontrado el usuario en la base de datos",
        );
        return;
      }

      const trimmedEmail = email.trim();

      // Construir el payload de actualización (sin tocar rol)
      const updatePayload: Parameters<typeof usuariosService.update>[1] = {
        name: nombre.trim(),
        email: trimmedEmail,
        avatarUrl: avatarUrl.trim() || undefined,
      };

      // Actualizar la fila en la tabla usuarios
      await usuariosService.update(dbUser.id, updatePayload);

      // Si el email ha cambiado, actualizar también el email del usuario de auth
      if (trimmedEmail && trimmedEmail !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: trimmedEmail,
        });

        if (authError) {
          console.warn("Error actualizando email en auth", authError);
          Alert.alert(
            "Aviso",
            "Se ha actualizado el email en la tabla de usuarios, pero no en la cuenta de acceso.",
          );
        }
      }

      // Sincronizar el store local con datos frescos desde BD (rol incluido)
      const refreshedDbUser = await usuariosService.getById(dbUser.id);

      updateNombre(nombre.trim());
      if (trimmedEmail) {
        updateEmail(trimmedEmail);
      }
      if (refreshedDbUser?.rol) {
        updateRol(refreshedDbUser.rol as UserRole);
      }
      if (refreshedDbUser?.avatarUrl) {
        updateAvatarUrl(refreshedDbUser.avatarUrl);
      } else if (avatarUrl.trim()) {
        updateAvatarUrl(avatarUrl.trim());
      }

      Alert.alert("Éxito", "Usuario actualizado correctamente", [
        {
          text: "OK",
          onPress: () => router.replace("/profile/profile"),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "No se ha podido actualizar el perfil. Inténtalo de nuevo.",
      );
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
        <Text style={styles.userEmail}>
          {email || user?.email || "usuario@example.com"}
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <Text style={styles.hint}>
            Este es el correo que se usa para comunicarte y acceder
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
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
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: colors.primaryButton,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      borderWidth: 2,
      borderColor: colors.borderMain,
    },
    avatarContainerPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
    avatarContainerDisabled: {
      opacity: 0.6,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: "800",
      color: "#fff",
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    avatarBadge: {
      position: "absolute",
      right: -2,
      bottom: -2,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primaryButton,
      borderWidth: 2,
      borderColor: colors.backgroundCard,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarHint: {
      fontSize: 12,
      color: colors.grayPlaceholder,
      fontWeight: "600",
      marginBottom: 8,
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
