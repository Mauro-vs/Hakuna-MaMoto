import { useCallback, useMemo, useState } from "react";
import { Alert, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { useThemeColors } from "../store/preferencesStore";
import { useModelo } from "./useModelos";
import { useUserStore } from "../store/userStore";
import { reservasService } from "../services/reservasService";

export const useModeloDetalle = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const modeloId = Number(id);
  const colors = useThemeColors();
  const { data: modelo, isLoading } = useModelo(modeloId);
  const user = useUserStore((state) => state.user);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [notas, setNotas] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);
  const activePicker = showInicioPicker
    ? "inicio"
    : showFinPicker
      ? "fin"
      : null;

  const isCliente = user?.rol === "NORMAL";
  const isAdmin = user?.rol === "ADMIN";
  const canViewReserveForm = isCliente || isAdmin;

  const canReserve = useMemo(() => {
    if (!canViewReserveForm || !user?.id || !user?.email) return false;
    if (!fechaInicio || !fechaFin) return false;
    const diff = fechaFin.getTime() - fechaInicio.getTime();
    return diff > 0;
  }, [canViewReserveForm, user?.id, user?.email, fechaInicio, fechaFin]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const formatDateEs = (value: Date | null) => {
    if (!value) return "";
    const day = String(value.getDate()).padStart(2, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const year = value.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateApi = (value: Date | null) =>
    value ? value.toISOString().slice(0, 10) : "";

  const daysCount = useMemo(() => {
    if (!fechaInicio || !fechaFin) return null;
    const diff = fechaFin.getTime() - fechaInicio.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  }, [fechaInicio, fechaFin]);

  const totalPrice = useMemo(
    () =>
      daysCount && modelo?.precioDia ? daysCount * modelo.precioDia : null,
    [daysCount, modelo?.precioDia],
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setFechaInicio(null);
        setFechaFin(null);
        setNotas("");
      };
    }, []),
  );

  const handleCreateReserva = async () => {
    if (!modelo) return;
    if (!user?.id || !user?.email) {
      Alert.alert("Error", "No se ha podido obtener el usuario actual");
      return;
    }
    if (!fechaInicio || !fechaFin) {
      Alert.alert("Error", "Debes indicar fecha de inicio y fin");
      return;
    }

    try {
      setIsSaving(true);
      await reservasService.createReserva({
        usuarioId: user.id,
        email: user.email,
        nombre: user.nombre,
        modeloId: modelo.id,
        precioDia: modelo.precioDia,
        fechaInicio: formatDateApi(fechaInicio),
        fechaFin: formatDateApi(fechaFin),
        notas: notas.trim() || undefined,
      });
      setNotas("");
      setFechaInicio(null);
      setFechaFin(null);
      Alert.alert(
        "Reserva creada",
        "Tu reserva se ha registrado correctamente",
        [
          {
            text: "OK",
            onPress: () => router.replace("/home"),
          },
        ],
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo crear la reserva");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeDate = (_event: any, selectedDate?: Date | undefined) => {
    if (Platform.OS !== "ios") {
      setShowInicioPicker(false);
      setShowFinPicker(false);
    }
    if (!selectedDate || !activePicker) return;

    if (activePicker === "inicio") {
      setFechaInicio(selectedDate);
      if (fechaFin && selectedDate > fechaFin) {
        setFechaFin(null);
      }
    }
    if (activePicker === "fin") {
      if (fechaInicio && selectedDate <= fechaInicio) {
        Alert.alert(
          "Fecha no válida",
          "La fecha de fin debe ser posterior a la fecha de inicio",
        );
        return;
      }
      setFechaFin(selectedDate);
    }
  };

  return {
    colors,
    modelo,
    isLoading,
    fechaInicio,
    fechaFin,
    notas,
    isSaving,
    showInicioPicker,
    showFinPicker,
    activePicker,
    canViewReserveForm,
    canReserve,
    today,
    daysCount,
    totalPrice,
    setShowInicioPicker,
    setShowFinPicker,
    setNotas,
    handleCreateReserva,
    handleChangeDate,
    formatDateEs,
  };
};
