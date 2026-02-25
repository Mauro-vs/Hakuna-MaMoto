import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUserStore } from "../store/userStore";
import { reservasService } from "../services/reservasService";

export interface ReservaLinea {
  dias?: number | null;
  precio_dia_pactado?: number | null;
  modelos?: { marca_modelo?: string | null } | null;
}

export interface Reserva {
  id: number;
  codigo_reserva: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  created_at?: string;
  notas_cliente?: string | null;
  lineas_reserva?: ReservaLinea[];
}

export type ActivePicker = "inicio" | "fin" | null;

export const useReservas = () => {
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.rol === "ADMIN";

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reservas, setReservas] = useState<Reserva[]>([]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingReservaId, setEditingReservaId] = useState<number | null>(null);
  const [editFechaInicio, setEditFechaInicio] = useState<Date | null>(null);
  const [editFechaFin, setEditFechaFin] = useState<Date | null>(null);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const formatDateEs = (value: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      const base = value.slice(0, 10);
      const parts = base.split("-");
      if (parts.length === 3) {
        const [y, m, d] = parts;
        return `${d}/${m}/${y}`;
      }
      return base;
    }
    return date.toLocaleDateString("es-ES");
  };

  const formatDateApi = (d: Date | null) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const loadReservas = useCallback(async () => {
    if (!user?.id) {
      setReservas([]);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      const data = await reservasService.listByUsuario(user.id);
      setReservas(data as Reserva[]);
    } catch (error) {
      console.error(error);
      setReservas([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadReservas();
  }, [loadReservas]);

  useFocusEffect(
    useCallback(() => {
      void loadReservas();
    }, [loadReservas]),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    void loadReservas();
  };

  const handleCancelReserva = useCallback(
    (reservaId: number) => {
      if (!user?.id) return;
      Alert.alert(
        "Cancelar reserva",
        "¿Seguro que quieres cancelar esta reserva?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí, cancelar",
            style: "destructive",
            onPress: async () => {
              try {
                await reservasService.updateEstadoReserva(
                  reservaId,
                  user.id,
                  "CANCELADA",
                );
                await loadReservas();
              } catch (error) {
                console.error(error);
                Alert.alert("Error", "No se pudo cancelar la reserva");
              }
            },
          },
        ],
      );
    },
    [loadReservas, user?.id],
  );

  const openEditFechas = useCallback(
    (reserva: Pick<Reserva, "id" | "fecha_inicio" | "fecha_fin">) => {
      const inicio = reserva.fecha_inicio
        ? new Date(reserva.fecha_inicio)
        : today;
      const fin = reserva.fecha_fin ? new Date(reserva.fecha_fin) : inicio;
      setEditingReservaId(reserva.id);
      setEditFechaInicio(inicio);
      setEditFechaFin(fin);
      setActivePicker(null);
      setEditModalVisible(true);
    },
    [today],
  );

  const closeEditModal = () => {
    setEditModalVisible(false);
    setActivePicker(null);
  };

  const handleSaveFechas = useCallback(async () => {
    if (!user?.id || !editingReservaId || !editFechaInicio || !editFechaFin) {
      Alert.alert("Error", "Faltan datos de la reserva o las fechas");
      return;
    }

    if (editFechaFin <= editFechaInicio) {
      Alert.alert(
        "Fecha no válida",
        "La fecha de fin debe ser posterior a la fecha de inicio",
      );
      return;
    }

    try {
      setIsSavingEdit(true);
      await reservasService.updateFechasReserva(
        editingReservaId,
        user.id,
        formatDateApi(editFechaInicio),
        formatDateApi(editFechaFin),
      );
      setEditModalVisible(false);
      setEditingReservaId(null);
      setEditFechaInicio(null);
      setEditFechaFin(null);
      await loadReservas();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron actualizar las fechas");
    } finally {
      setIsSavingEdit(false);
    }
  }, [user?.id, editingReservaId, editFechaInicio, editFechaFin, loadReservas]);

  return {
    // datos usuario
    isAdmin,

    // estado reservas
    reservas,
    isLoading,
    isRefreshing,
    handleRefresh,
    formatDateEs,

    // edición fechas
    editModalVisible,
    openEditFechas,
    closeEditModal,
    editFechaInicio,
    editFechaFin,
    today,
    activePicker,
    setActivePicker,
    setEditFechaInicio,
    setEditFechaFin,
    handleSaveFechas,
    isSavingEdit,

    // acciones reserva
    handleCancelReserva,
  };
};
