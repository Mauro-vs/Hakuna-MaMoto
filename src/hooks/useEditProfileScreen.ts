import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { useThemeColors } from "../store/preferencesStore";
import { useUserStore } from "../store/userStore";
import { usuariosService } from "../services/usuariosService";
import { supabase } from "../services/supabaseClient";
import { UserRole } from "../types/types";
import { Platform } from "react-native";

export const useEditProfileScreen = () => {
  const router = useRouter();
  const colors = useThemeColors();
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
  }, [user?.email, updateAvatarUrl]);

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
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      await new Promise((resolve) => setTimeout(resolve, 300));

      const dbUser = await usuariosService.getByEmail(user.email);

      if (!dbUser) {
        Alert.alert(
          "Error",
          "No se ha encontrado el usuario en la base de datos",
        );
        return;
      }

      const trimmedEmail = email.trim();

      const updatePayload: Parameters<typeof usuariosService.update>[1] = {
        name: nombre.trim(),
        email: trimmedEmail,
        avatarUrl: avatarUrl.trim() || undefined,
      };

      await usuariosService.update(dbUser.id, updatePayload);

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

  return {
    colors,
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
  };
};
