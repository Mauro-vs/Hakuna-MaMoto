import { useEffect, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { useThemeColors } from "../store/preferencesStore";
import { useModelosList } from "../hooks/useModelos";
import { useUserStore } from "../store/userStore";
import { modelosService } from "../services/modelosService";
import { supabase } from "../services/supabaseClient";
import type { Modelo } from "../data/Modelos";
import { useFavoritesStore } from "../store/favoritesStore";

export const useModelosScreen = () => {
  const colors = useThemeColors();
  const { data, isLoading, isError, refetch } = useModelosList();
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.rol === "ADMIN";
  const [modalVisible, setModalVisible] = useState(false);
  const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [search, setSearch] = useState("");
  const [ccFilter, setCcFilter] = useState<"ALL" | "LOW" | "MID" | "HIGH">(
    "ALL",
  );
  const [form, setForm] = useState({
    marcaModelo: "",
    descripcion: "",
    cilindrada: "",
    precioDia: "",
    imagenUrl: "",
  });

  const list = data ?? [];

  const filteredList = useMemo(() => {
    const term = search.trim().toLowerCase();

    return list.filter((item) => {
      const matchesSearch =
        !term ||
        [item.marcaModelo, item.descripcion, item.cilindrada]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term));

      if (!matchesSearch) return false;

      if (ccFilter === "ALL") return true;

      const numericCc = parseInt(
        (item.cilindrada ?? "").replace(/\D/g, ""),
        10,
      );
      if (!Number.isFinite(numericCc)) return false;

      if (ccFilter === "LOW") return numericCc < 300;
      if (ccFilter === "MID") return numericCc >= 300 && numericCc <= 600;
      if (ccFilter === "HIGH") return numericCc > 600;

      return true;
    });
  }, [list, search, ccFilter]);

  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

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
      cilindrada: item.cilindrada ? item.cilindrada.replace(/\D/g, "") : "",
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
    const fileName = `modelos/${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

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

  return {
    colors,
    list,
    filteredList,
    isLoading,
    isError,
    isAdmin,
    modalVisible,
    editingModelo,
    isSaving,
    isUploadingImage,
    form,
    setForm,
    search,
    setSearch,
    ccFilter,
    setCcFilter,
    openCreate,
    openEdit,
    handleSave,
    openImageOptions,
    handleDelete,
    buildImagePreviewUrl,
    setModalVisible,
  };
};
