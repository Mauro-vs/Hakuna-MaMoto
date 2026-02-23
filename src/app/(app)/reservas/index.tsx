import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Platform, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useThemeColors } from "../../../store/preferencesStore";
import { useUserStore } from "../../../store/userStore";
import { reservasService } from "../../../services/reservasService";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ReservasScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useUserStore((state: { user: any; }) => state.user);
  const isAdmin = user?.rol === "ADMIN";
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reservas, setReservas] = useState<Array<{
    id: number;
    codigo_reserva: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    created_at?: string;
    notas_cliente?: string | null;
    lineas_reserva?: Array<{
      dias?: number | null;
      precio_dia_pactado?: number | null;
      modelos?: { marca_modelo?: string | null } | null;
    }>;
  }>>([]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingReservaId, setEditingReservaId] = useState<number | null>(null);
  const [editFechaInicio, setEditFechaInicio] = useState<Date | null>(null);
  const [editFechaFin, setEditFechaFin] = useState<Date | null>(null);
  const [activePicker, setActivePicker] = useState<"inicio" | "fin" | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const formatDateEs = (value: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      // Si no se puede parsear, intento formatear manualmente 'YYYY-MM-DD' -> 'DD/MM/YYYY'
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

  const loadReservas = useCallback(async () => {
    if (!user?.id) {
      setReservas([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await reservasService.listByUsuario(user.id);
      setReservas(data as typeof reservas);
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
                await reservasService.updateEstadoReserva(reservaId, user.id, "CANCELADA");
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
    [loadReservas],
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const openEditFechas = useCallback(
    (reserva: { id: number; fecha_inicio: string; fecha_fin: string }) => {
      const inicio = reserva.fecha_inicio ? new Date(reserva.fecha_inicio) : today;
      const fin = reserva.fecha_fin ? new Date(reserva.fecha_fin) : inicio;
      setEditingReservaId(reserva.id);
      setEditFechaInicio(inicio);
      setEditFechaFin(fin);
      setActivePicker(null);
      setEditModalVisible(true);
    },
    [today],
  );

  const formatDateApi = (d: Date | null) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSaveFechas = useCallback(async () => {
    if (!user?.id || !editingReservaId || !editFechaInicio || !editFechaFin) {
      Alert.alert("Error", "Faltan datos de la reserva o las fechas");
      return;
    }

    if (editFechaFin <= editFechaInicio) {
      Alert.alert("Fecha no válida", "La fecha de fin debe ser posterior a la fecha de inicio");
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

  useFocusEffect(
    useCallback(() => {
      void loadReservas();
    }, [loadReservas])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primaryButton} />
        <Text style={styles.helper}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Mis reservas" }} />
      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={reservas.length === 0 ? styles.emptyContainer : undefined}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>Tus reservas</Text>
                <Text style={styles.headerSubtitle}>Total: {reservas.length}</Text>
              </View>
            </View>
            <Text style={styles.headerHelper}>
              Revisa aquí el estado y las fechas de tus próximas reservas.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              void loadReservas();
            }}
            tintColor={colors.primaryButton}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <Ionicons name="calendar-outline" size={36} color={colors.grayPlaceholder} />
            <Text style={styles.emptyTitle}>Aún no tienes reservas</Text>
            <Text style={styles.emptyText}>
              Cuando hagas una reserva, aparecerá aquí con sus fechas e información.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const canCancel = item.estado !== "CANCELADA" && item.estado !== "FINALIZADA";
          const canEditDates = item.estado === "PREPARADA";

          return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.codeRow}>
                <Ionicons name="document-text-outline" size={16} color={colors.grayLabelText} />
                <Text style={styles.code}>{item.codigo_reserva}</Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  item.estado === "PREPARADA" && styles.statusPrepared,
                  item.estado === "ENTREGADA" && styles.statusDelivered,
                  item.estado === "DEVUELTA" && styles.statusReturned,
                  item.estado === "REVISION" && styles.statusReview,
                  item.estado === "FINALIZADA" && styles.statusFinished,
                  item.estado === "CANCELADA" && styles.statusCancel,
                ]}
              >
                <Text style={styles.statusText}>{item.estado}</Text>
              </View>
            </View>

            {item.lineas_reserva?.[0] ? (
              <View style={styles.modelRow}>
                <Ionicons name="bicycle-outline" size={14} color={colors.grayLabelText} />
                <Text style={styles.modelText}>
                  {item.lineas_reserva[0].modelos?.marca_modelo ?? "Modelo"}
                </Text>
              </View>
            ) : null}

            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.grayLabelText} />
                <Text style={styles.metaLabel}>Inicio</Text>
                <Text style={styles.metaValue}>{formatDateEs(item.fecha_inicio)}</Text>
              </View>
              <View style={styles.dateSeparator} />
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.grayLabelText} />
                <Text style={styles.metaLabel}>Fin</Text>
                <Text style={styles.metaValue}>{formatDateEs(item.fecha_fin)}</Text>
              </View>
            </View>

            {item.lineas_reserva?.[0] ? (
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>
                  {item.lineas_reserva[0].dias ?? "-"} días ·
                  {" "}
                  {item.lineas_reserva[0].precio_dia_pactado != null
                    ? `${item.lineas_reserva[0].precio_dia_pactado.toFixed(2)} €/día`
                    : "- €/día"}
                </Text>
                {item.lineas_reserva[0].dias != null &&
                  item.lineas_reserva[0].precio_dia_pactado != null && (
                    <Text style={styles.totalText}>
                      Total:
                      {" "}
                      {(item.lineas_reserva[0].dias * item.lineas_reserva[0].precio_dia_pactado).toFixed(2)} €
                    </Text>
                  )}
              </View>
            ) : null}

            {item.notas_cliente ? (
              <View style={styles.notesBox}>
                <Text style={styles.notesLabel}>Notas del cliente</Text>
                <Text style={styles.notesText}>{item.notas_cliente}</Text>
              </View>
            ) : null}
            {!isAdmin && (canCancel || canEditDates) && (
              <View style={styles.actionsRow}>
                {canEditDates && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditFechas(item)}
                  >
                    <Text style={styles.editButtonText}>Cambiar fechas</Text>
                  </TouchableOpacity>
                )}
                {canCancel && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelReserva(item.id)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar reserva</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );}}
      />
      {editModalVisible && (
        <Modal
          transparent
          animationType="fade"
          visible={editModalVisible}
          onRequestClose={() => {
            setEditModalVisible(false);
            setActivePicker(null);
          }}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              setEditModalVisible(false);
              setActivePicker(null);
            }}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar fechas</Text>
                <Pressable
                  onPress={() => {
                    setEditModalVisible(false);
                    setActivePicker(null);
                  }}
                >
                  <Text style={styles.modalAction}>Cerrar</Text>
                </Pressable>
              </View>

              <View style={styles.modalRow}>
                <TouchableOpacity
                  style={styles.modalDateButton}
                  onPress={() => setActivePicker("inicio")}
                >
                  <Text style={styles.modalDateLabel}>Inicio</Text>
                  <Text style={styles.modalDateValue}>
                    {editFechaInicio ? formatDateEs(editFechaInicio.toISOString()) : "Selecciona fecha"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDateButton}
                  onPress={() => setActivePicker("fin")}
                >
                  <Text style={styles.modalDateLabel}>Fin</Text>
                  <Text style={styles.modalDateValue}>
                    {editFechaFin ? formatDateEs(editFechaFin.toISOString()) : "Selecciona fecha"}
                  </Text>
                </TouchableOpacity>
              </View>

              {activePicker && (
                <View style={styles.pickerWrapper}>
                  <DateTimePicker
                    value={(activePicker === "inicio" ? editFechaInicio : editFechaFin) ?? today}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    minimumDate={activePicker === "inicio" ? today : editFechaInicio ?? today}
                    onChange={(_event, selectedDate) => {
                      if (Platform.OS !== "ios") {
                        setActivePicker(null);
                      }
                      if (!selectedDate) return;
                      if (activePicker === "inicio") {
                        setEditFechaInicio(selectedDate);
                        if (editFechaFin && selectedDate > editFechaFin) {
                          setEditFechaFin(null);
                        }
                      }
                      if (activePicker === "fin") {
                        if (editFechaInicio && selectedDate <= editFechaInicio) {
                          Alert.alert(
                            "Fecha no válida",
                            "La fecha de fin debe ser posterior a la fecha de inicio",
                          );
                          return;
                        }
                        setEditFechaFin(selectedDate);
                      }
                    }}
                  />
                </View>
              )}

              <View style={styles.modalActionsRow}>
                <TouchableOpacity
                  style={[styles.saveEditButton, isSavingEdit && styles.saveEditButtonDisabled]}
                  onPress={handleSaveFechas}
                  disabled={isSavingEdit}
                >
                  <Text style={styles.saveEditButtonText}>
                    {isSavingEdit ? "Guardando..." : "Guardar cambios"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundMain,
      padding: 16,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundMain,
    },
    helper: {
      marginTop: 12,
      color: colors.grayLabelText,
    },
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    header: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textTitle,
    },
    headerSubtitle: {
      marginTop: 4,
      fontSize: 12,
      color: colors.grayLabelText,
    },
    headerHelper: {
      marginTop: 4,
      fontSize: 11,
      color: colors.grayPlaceholder,
    },
    headerIconBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: colors.borderMain,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tabBackground,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 6,
    },
    codeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    code: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textTitle,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
      gap: 12,
    },
    dateItem: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    dateSeparator: {
      width: 1,
      height: 18,
      backgroundColor: colors.borderMain,
      opacity: 0.4,
    },
    modelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 4,
    },
    modelText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textBody,
    },
    metaLabel: {
      fontSize: 11,
      color: colors.grayLabelText,
      textTransform: "uppercase",
    },
    metaValue: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textBody,
    },
    priceRow: {
      marginTop: 6,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    priceText: {
      fontSize: 12,
      color: colors.textBody,
    },
    totalText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textTitle,
    },
    statusPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: colors.tabBackground,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.textBody,
    },
    statusPrepared: {
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      borderColor: "#3B82F6",
    },
    statusDelivered: {
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "#10B981",
    },
    statusReturned: {
      backgroundColor: "rgba(37, 99, 235, 0.12)",
      borderColor: "#2563EB",
    },
    statusReview: {
      backgroundColor: "rgba(245, 158, 11, 0.15)",
      borderColor: "#F59E0B",
    },
    statusFinished: {
      backgroundColor: "rgba(22, 163, 74, 0.18)",
      borderColor: "#16A34A",
    },
    actionsRow: {
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    cancelButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.errorBorder,
      backgroundColor: "rgba(239, 68, 68, 0.06)",
    },
    cancelButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.errorText,
    },
    editButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.borderMain,
      backgroundColor: colors.backgroundMain,
      marginRight: 8,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textBody,
    },
    statusCancel: {
      backgroundColor: "rgba(239, 68, 68, 0.15)",
      borderColor: "#EF4444",
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyWrapper: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
      gap: 8,
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textTitle,
    },
    emptyText: {
      color: colors.grayPlaceholder,
      fontSize: 13,
      textAlign: "center",
      paddingHorizontal: 24,
    },
    notesBox: {
      marginTop: 8,
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.backgroundMain,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    notesLabel: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.grayLabelText,
      marginBottom: 2,
    },
    notesText: {
      fontSize: 12,
      color: colors.textBody,
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalCard: {
      width: "90%",
      maxWidth: 420,
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textTitle,
    },
    modalAction: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primaryButton,
    },
    modalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
      marginBottom: 12,
    },
    modalDateButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.inputBackground,
    },
    modalDateLabel: {
      fontSize: 11,
      color: colors.grayLabelText,
      textTransform: "uppercase",
    },
    modalDateValue: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textBody,
      fontWeight: "600",
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: colors.borderMain,
      borderRadius: 10,
      padding: 6,
      marginBottom: 12,
      backgroundColor: colors.backgroundMain,
    },
    modalActionsRow: {
      marginTop: 4,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    saveEditButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: colors.primaryButton,
    },
    saveEditButtonDisabled: {
      opacity: 0.7,
    },
    saveEditButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#fff",
    },
  });
