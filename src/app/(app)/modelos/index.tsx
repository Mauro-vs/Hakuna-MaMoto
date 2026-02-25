import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { useThemeColors } from "../../../store/preferencesStore";
import { useModelosList } from "../../../hooks/useModelos";
import { ModeloCard } from "../../../components/modelosPages/ModeloCard";
import { useUserStore } from "../../../store/userStore";
import { modelosService } from "../../../services/modelosService";
import { supabase } from "../../../services/supabaseClient";
import type { Modelo } from "../../../data/Modelos";
import { useFavoritesStore } from "../../../store/favoritesStore";
import { useEffect } from "react";

export default function ModelosScreen() {
  const colors = useThemeColors();
  const s = createStyles(colors);
  const { data, isLoading, isError, refetch } = useModelosList();
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.rol === "ADMIN";
  const [modalVisible, setModalVisible] = useState(false);
  const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [form, setForm] = useState({
    marcaModelo: "",
    descripcion: "",
    cilindrada: "",
    precioDia: "",
    imagenUrl: "",
  });
  const list = data ?? [];

  const buildImagePreviewUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const { data: imageData } = supabase.storage
      .from("motos")
      .getPublicUrl(trimmed);
    return imageData.publicUrl;
  };

  const resetForm = () =>
    setForm({
      marcaModelo: "",
      descripcion: "",
      cilindrada: "",
      precioDia: "",
      imagenUrl: "",
    });

  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, []);

  const openCreate = () => {
    setEditingModelo(null);
    resetForm();
    setModalVisible(true);
  };

  const openEdit = (item: Modelo) => {
    setEditingModelo(item);
    setForm({
      marcaModelo: item.marcaModelo ?? "",
      descripcion: item.descripcion ?? "",
      cilindrada: item.cilindrada ?? "",
      precioDia: item.precioDia ? String(item.precioDia) : "",
      imagenUrl: item.imagenUrl ?? "",
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.marcaModelo.trim()) {
      Alert.alert("Error", "El nombre del modelo es obligatorio");
      return;
    }

    const precio = Number(form.precioDia);
    if (!Number.isFinite(precio) || precio <= 0) {
      Alert.alert("Error", "El precio por dia debe ser un numero valido");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        marcaModelo: form.marcaModelo.trim(),
        descripcion: form.descripcion.trim() || null,
        cilindrada: form.cilindrada.trim() || null,
        precioDia: precio,
        imagenUrl: form.imagenUrl.trim() || null,
      };

      if (editingModelo) {
        await modelosService.updateModelo(editingModelo.id, payload);
      } else {
        await modelosService.createModelo(payload);
      }

      await refetch();
      setModalVisible(false);
      setEditingModelo(null);
      resetForm();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo guardar el modelo");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadModeloImage = async (uri: string) => {
    const fileExt = (uri.split(".").pop() || "jpg").toLowerCase();
    const fileName = `modelos/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

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
      .from("motos")
      .upload(fileName, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) throw error;
    const { data } = supabase.storage.from("motos").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePickImageFromLibrary = async () => {
    try {
      setIsUploadingImage(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitamos acceso a tus fotos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const publicUrl = await uploadModeloImage(result.assets[0].uri);
      setForm((prev) => ({ ...prev, imagenUrl: publicUrl }));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo subir la imagen");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePickImageFromCamera = async () => {
    try {
      setIsUploadingImage(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const publicUrl = await uploadModeloImage(result.assets[0].uri);
      setForm((prev) => ({ ...prev, imagenUrl: publicUrl }));
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo hacer la foto");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const openImageOptions = () => {
    Alert.alert("Seleccionar imagen", "Elige de dónde obtener la imagen", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Galería",
        onPress: () => {
          void handlePickImageFromLibrary();
        },
      },
      {
        text: "Cámara",
        onPress: () => {
          void handlePickImageFromCamera();
        },
      },
    ]);
  };

  const handleDelete = (item: Modelo) => {
    Alert.alert(
      "Eliminar modelo",
      "Esto desactivara el modelo (no se elimina de forma permanente)",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await modelosService.softDeleteModelo(item.id);
              await refetch();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "No se pudo eliminar el modelo");
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={[s.screen, s.center]}>
        <ActivityIndicator size="large" color={colors.primaryButton} />
        <Text style={s.statusText}>Cargando modelos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.errorText}>Error cargando modelos</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Modelos" }} />
      <View style={s.screen}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ModeloCard
              item={item}
              isAdmin={isAdmin}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={
            list.length === 0 ? s.listEmpty : s.listContent
          }
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Text style={s.emptyTitle}>No hay modelos disponibles</Text>
              <Text style={s.emptyDesc}>
                {isAdmin
                  ? "Agrega modelos para que los clientes puedan reservar"
                  : "Contacta con un administrador para agregar modelos"}
              </Text>
            </View>
          }
        />

        {isAdmin ? (
          <TouchableOpacity style={s.fab} onPress={openCreate}>
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal transparent animationType="fade" visible={modalVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={s.modalWrapper}
        >
          <Pressable
            style={s.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>
              {editingModelo ? "Editar modelo" : "Nuevo modelo"}
            </Text>
            <ScrollView contentContainerStyle={s.modalContent}>
              <Text style={s.label}>Marca / Modelo</Text>
              <TextInput
                style={s.input}
                value={form.marcaModelo}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, marcaModelo: value }))
                }
                placeholder="Yamaha MT-07"
                placeholderTextColor={colors.grayPlaceholder}
              />

              <Text style={s.label}>Descripcion</Text>
              <TextInput
                style={[s.input, s.inputMultiline]}
                value={form.descripcion}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, descripcion: value }))
                }
                placeholder="Descripcion del modelo"
                placeholderTextColor={colors.grayPlaceholder}
                multiline
              />

              <Text style={s.label}>Cilindrada</Text>
              <TextInput
                style={s.input}
                value={form.cilindrada}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, cilindrada: value }))
                }
                placeholder="689 cc"
                placeholderTextColor={colors.grayPlaceholder}
              />

              <Text style={s.label}>Precio por dia</Text>
              <TextInput
                style={s.input}
                value={form.precioDia}
                onChangeText={(value) =>
                  setForm((prev) => ({ ...prev, precioDia: value }))
                }
                placeholder="35"
                placeholderTextColor={colors.grayPlaceholder}
                keyboardType="decimal-pad"
              />

              <Text style={s.label}>Imagen (opcional)</Text>
              {form.imagenUrl ? (
                <View style={s.imagePreviewWrap}>
                  <Image
                    source={{ uri: buildImagePreviewUrl(form.imagenUrl) }}
                    style={s.imagePreview}
                  />
                </View>
              ) : null}
              <View style={s.imageActionsRow}>
                <TouchableOpacity
                  style={[
                    s.imageButton,
                    isUploadingImage && s.imageButtonDisabled,
                  ]}
                  onPress={openImageOptions}
                  disabled={isUploadingImage}
                >
                  <Text style={s.imageButtonText}>
                    {isUploadingImage ? "Subiendo..." : "Elegir imagen"}
                  </Text>
                </TouchableOpacity>
                {form.imagenUrl ? (
                  <TouchableOpacity
                    style={s.imageClearButton}
                    onPress={() =>
                      setForm((prev) => ({ ...prev, imagenUrl: "" }))
                    }
                  >
                    <Text style={s.imageClearText}>Quitar</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </ScrollView>

            <View style={s.modalActions}>
              <TouchableOpacity
                style={s.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={isSaving}
              >
                <Text style={s.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.saveButton, isSaving && s.saveButtonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={s.saveText}>
                  {isSaving ? "Guardando..." : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.backgroundMain,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    statusText: {
      marginTop: 12,
      color: colors.grayLabelText,
    },
    errorText: {
      color: colors.errorText,
    },
    listContent: {
      paddingBottom: 12,
    },
    listEmpty: {
      flexGrow: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.grayLabelText,
    },
    emptyDesc: {
      fontSize: 12,
      color: colors.grayPlaceholder,
    },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      backgroundColor: colors.primaryButton,
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
    },
    modalWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalCard: {
      width: "90%",
      maxWidth: 420,
      maxHeight: "85%",
      backgroundColor: colors.backgroundCard,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 12,
    },
    modalContent: {
      paddingBottom: 10,
    },
    label: {
      fontSize: 12,
      color: colors.grayLabelText,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: colors.textInput,
      backgroundColor: colors.inputBackground,
      marginBottom: 12,
    },
    inputMultiline: {
      minHeight: 70,
      textAlignVertical: "top",
    },
    imagePreviewWrap: {
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.borderMain,
      marginBottom: 10,
      backgroundColor: colors.tabBackground,
    },
    imagePreview: {
      width: "100%",
      height: 160,
      resizeMode: "cover",
    },
    imageActionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    imageButton: {
      backgroundColor: colors.primaryButton,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
    },
    imageButtonDisabled: {
      opacity: 0.7,
    },
    imageButtonText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "700",
    },
    imageClearButton: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    imageClearText: {
      color: colors.grayLabelText,
      fontSize: 13,
      fontWeight: "600",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
      marginTop: 6,
    },
    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    cancelText: {
      color: colors.grayLabelText,
      fontSize: 14,
      fontWeight: "600",
    },
    saveButton: {
      backgroundColor: colors.primaryButton,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 10,
    },
    saveButtonDisabled: {
      opacity: 0.7,
    },
    saveText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "700",
    },
  });
