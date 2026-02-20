import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useThemeColors } from "../../../store/preferencesStore";
import { useModelo } from "../../../hooks/useModelos";
import { useUserStore } from "../../../store/userStore";
import { reservasService } from "../../../services/reservasService";

export default function ModeloDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const modeloId = Number(id);
  const colors = useThemeColors();
  const s = createStyles(colors);
  const { data: modelo, isLoading } = useModelo(modeloId);
  const user = useUserStore((state) => state.user);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [notas, setNotas] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showFinPicker, setShowFinPicker] = useState(false);
  const activePicker = showInicioPicker ? "inicio" : showFinPicker ? "fin" : null;

  const isCliente = user?.rol === "NORMAL";
  const isAdmin = user?.rol === "ADMIN";
  const canViewReserveForm = isCliente || isAdmin;
  const canReserve = useMemo(
    () => canViewReserveForm && !!user?.id && !!user?.email,
    [canViewReserveForm, user?.id, user?.email],
  );
  const formatDate = (value: Date | null) => (value ? value.toISOString().slice(0, 10) : "");
  const daysCount = useMemo(() => {
    if (!fechaInicio || !fechaFin) return null;
    const diff = fechaFin.getTime() - fechaInicio.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  }, [fechaInicio, fechaFin]);
  const totalPrice = daysCount ? daysCount * (modelo?.precioDia ?? 0) : null;

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
                {fechaInicio ? formatDate(fechaInicio) : "Fecha inicio"}
              </Text>
            </Pressable>
            <Pressable
              style={s.inputButton}
              onPress={() => setShowFinPicker(true)}
            >
              <Text style={fechaFin ? s.inputText : s.inputPlaceholder}>
                {fechaFin ? formatDate(fechaFin) : "Fecha fin"}
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
              <Text style={s.summaryText}>Inicio: {formatDate(fechaInicio) || "-"}</Text>
              <Text style={s.summaryText}>Fin: {formatDate(fechaFin) || "-"}</Text>
              <Text style={s.summaryText}>Dias: {daysCount ?? "-"}</Text>
              <Text style={s.summaryText}>
                Total: {totalPrice !== null ? `${totalPrice.toFixed(2)} €` : "-"}
              </Text>
              <Text style={s.summaryText}>Notas: {notas.trim() || "-"}</Text>
            </View>

            <TouchableOpacity
              style={[s.reserveButton, !canReserve && s.reserveButtonDisabled]}
              disabled={!canReserve || isSaving}
              onPress={async () => {
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
                    fechaInicio: formatDate(fechaInicio),
                    fechaFin: formatDate(fechaFin),
                    notas: notas.trim() || undefined,
                  });
                  setNotas("");
                  setFechaInicio(null);
                  setFechaFin(null);
                  Alert.alert("Reserva creada", "Tu reserva se ha registrado correctamente", [
                    {
                      text: "OK",
                      onPress: () => router.replace("/home"),
                    },
                  ]);
                } catch (error) {
                  console.error(error);
                  Alert.alert("Error", "No se pudo crear la reserva");
                } finally {
                  setIsSaving(false);
                }
              }}
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
              onChange={(_event, selectedDate) => {
                if (Platform.OS !== "ios") {
                  setShowInicioPicker(false);
                  setShowFinPicker(false);
                }
                if (!selectedDate) return;
                if (activePicker === "inicio") setFechaInicio(selectedDate);
                if (activePicker === "fin") setFechaFin(selectedDate);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundMain,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundMain,
    },
    loadingText: {
      marginTop: 12,
      color: colors.textValue,
    },
    error: {
      color: colors.errorText,
      fontSize: 16,
    },
    backButton: {
      padding: 10,
    },
    hero: {
      height: 240,
      backgroundColor: colors.tabBackground,
    },
    heroImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    heroFallback: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    heroFallbackText: {
      fontSize: 12,
      color: colors.grayLabelText,
    },
    content: {
      padding: 16,
      gap: 10,
      paddingBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textTitle,
    },
    desc: {
      fontSize: 14,
      color: colors.textBody,
    },
    metaRow: {
      flexDirection: "row",
      gap: 12,
      flexWrap: "wrap",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.backgroundCard,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    metaText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.grayLabelText,
    },
    reserveButton: {
      marginTop: 12,
      backgroundColor: colors.primaryButton,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
    },
    reserveButtonDisabled: {
      opacity: 0.6,
    },
    reserveText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },
    formCard: {
      marginTop: 12,
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    formTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textTitle,
    },
    formHint: {
      fontSize: 12,
      color: colors.grayPlaceholder,
    },
    inputButton: {
      borderWidth: 1,
      borderColor: colors.borderMain,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: colors.backgroundMain,
    },
    inputText: {
      fontSize: 14,
      color: colors.textTitle,
    },
    inputPlaceholder: {
      fontSize: 14,
      color: colors.grayPlaceholder,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.borderMain,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.textTitle,
      backgroundColor: colors.backgroundMain,
    },
    inputNotes: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    summaryCard: {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.borderMain,
      backgroundColor: colors.tabBackground,
      gap: 4,
    },
    summaryTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 4,
    },
    summaryText: {
      fontSize: 12,
      color: colors.textBody,
    },
    infoCard: {
      marginTop: 12,
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    infoTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 6,
    },
    infoText: {
      fontSize: 13,
      color: colors.textBody,
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-start",
      paddingTop: 80,
      paddingHorizontal: 16,
    },
    modalCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderMain,
      overflow: "hidden",
    },
    modalHeader: {
      backgroundColor: colors.primaryButton,
      paddingHorizontal: 14,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: "#ffffff",
    },
    modalAction: {
      fontSize: 13,
      fontWeight: "800",
      color: "#ffffff",
    },
  });
