import React, { useMemo } from "react";
import { View, Text, ActivityIndicator, Image, TouchableOpacity, Modal, Pressable, ScrollView, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useThemeColors } from "../../../store/preferencesStore";
import { createModeloDetalleStyles } from "../../../style/modeloDetalle.styles";
import { useModeloDetalle } from "../../../useControllers/useModeloDetalle";

export default function ModeloDetalle() {
  const colors = useThemeColors();
  const s = useMemo(() => createModeloDetalleStyles(colors), [colors]);
  const {
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
  } = useModeloDetalle();

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.primaryHeader} />
        <Text style={s.loadingText}>Cargando modelo...</Text>
      </View>
    );
  }

  if (!modelo) {
    return (
      <View style={s.center}>
        <Text style={s.error}>Modelo no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Stack.Screen
        options={{
          title: "Detalle del modelo",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/modelos")} style={s.backButton}>
              <Ionicons name="chevron-back" size={22} color={colors.headerText} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={s.content}>
        <View style={s.hero}>
          {modelo.imagenUrl ? (
            <Image source={{ uri: modelo.imagenUrl }} style={s.heroImage} />
          ) : (
            <View style={s.heroFallback}>
              <Ionicons name="image-outline" size={40} color={colors.grayLabelText} />
              <Text style={s.heroFallbackText}>Sin imagen</Text>
            </View>
          )}
        </View>

        <Text style={s.title}>{modelo.marcaModelo}</Text>
        {modelo.descripcion ? <Text style={s.desc}>{modelo.descripcion}</Text> : null}

        <View style={s.metaRow}>
          {modelo.cilindrada ? (
            <View style={s.metaItem}>
              <Ionicons name="speedometer-outline" size={16} color={colors.grayLabelText} />
              <Text style={s.metaText}>{modelo.cilindrada}</Text>
            </View>
          ) : null}
          <View style={s.metaItem}>
            <Ionicons name="cash-outline" size={16} color={colors.grayLabelText} />
            <Text style={s.metaText}>{modelo.precioDia.toFixed(2)} €/dia</Text>
          </View>
        </View>

        {canViewReserveForm ? (
          <View style={s.formCard}>
            <Text style={s.formTitle}>Reserva este modelo</Text>
            <Text style={s.formHint}>Selecciona fechas desde el calendario</Text>
            <Pressable
              style={s.inputButton}
              onPress={() => setShowInicioPicker(true)}
            >
              <Text style={fechaInicio ? s.inputText : s.inputPlaceholder}>
                {fechaInicio ? formatDateEs(fechaInicio) : "Fecha inicio"}
              </Text>
            </Pressable>
            <Pressable
              style={s.inputButton}
              onPress={() => setShowFinPicker(true)}
            >
              <Text style={fechaFin ? s.inputText : s.inputPlaceholder}>
                {fechaFin ? formatDateEs(fechaFin) : "Fecha fin"}
              </Text>
            </Pressable>
            <TextInput
              style={[s.input, s.inputNotes]}
              placeholder="Notas (opcional)"
              placeholderTextColor={colors.grayPlaceholder}
              value={notas}
              onChangeText={setNotas}
              multiline
            />

            <View style={s.summaryCard}>
              <Text style={s.summaryTitle}>Resumen</Text>
              <Text style={s.summaryText}>Modelo: {modelo.marcaModelo}</Text>
              <Text style={s.summaryText}>Inicio: {formatDateEs(fechaInicio) || "-"}</Text>
              <Text style={s.summaryText}>Fin: {formatDateEs(fechaFin) || "-"}</Text>
              <Text style={s.summaryText}>Dias: {daysCount ?? "-"}</Text>
              <Text style={s.summaryText}>
                Total: {totalPrice !== null ? `${totalPrice.toFixed(2)} €` : "-"}
              </Text>
              <Text style={s.summaryText}>Notas: {notas.trim() || "-"}</Text>
            </View>

            <TouchableOpacity
              style={[s.reserveButton, !canReserve && s.reserveButtonDisabled]}
              disabled={!canReserve || isSaving}
              onPress={handleCreateReserva}
            >
              <Text style={s.reserveText}>{isSaving ? "Guardando..." : "Reservar"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.infoCard}>
            <Text style={s.infoTitle}>Solo clientes o admin pueden reservar</Text>
            <Text style={s.infoText}>
              Para crear reservas debes acceder con una cuenta permitida.
            </Text>
          </View>
        )}

      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={!!activePicker}
        onRequestClose={() => {
          setShowInicioPicker(false);
          setShowFinPicker(false);
        }}
      >
        <Pressable
          style={s.modalBackdrop}
          onPress={() => {
            setShowInicioPicker(false);
            setShowFinPicker(false);
          }}
        />
        <View style={s.modalContainer}>
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>
                {activePicker === "inicio" ? "Fecha inicio" : "Fecha fin"}
              </Text>
              <Pressable
                onPress={() => {
                  setShowInicioPicker(false);
                  setShowFinPicker(false);
                }}
              >
                <Text style={s.modalAction}>Listo</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={(activePicker === "inicio" ? fechaInicio : fechaFin) ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "calendar"}
              minimumDate={activePicker === "inicio" ? today : fechaInicio ?? today}
              onChange={handleChangeDate}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
