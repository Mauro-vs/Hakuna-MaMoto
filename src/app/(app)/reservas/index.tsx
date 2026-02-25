import React, { useMemo } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Platform, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useThemeColors } from "../../../store/preferencesStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createReservasStyles } from "../../../style/reservas.styles";
import { useReservas } from "../../../useControllers/useReservas";

export default function ReservasScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createReservasStyles(colors), [colors]);

  const {
    isAdmin,
    reservas,
    isLoading,
    isRefreshing,
    handleRefresh,
    formatDateEs,
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
    handleCancelReserva,
  } = useReservas();

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
            onRefresh={handleRefresh}
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
            closeEditModal();
          }}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              closeEditModal();
            }}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar fechas</Text>
                <Pressable
                  onPress={() => {
                    closeEditModal();
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
