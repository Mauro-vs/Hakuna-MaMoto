import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useThemeColors } from "../../../store/preferencesStore";
import { useUserStore } from "../../../store/userStore";
import { reservasService } from "../../../services/reservasService";

export default function ReservasScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const user = useUserStore((state: { user: any; }) => state.user);
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
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.codeRow}>
                <Ionicons name="document-text-outline" size={16} color={colors.grayLabelText} />
                <Text style={styles.code}>{item.codigo_reserva}</Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  item.estado === "CONFIRMADA" && styles.statusSuccess,
                  item.estado === "PENDIENTE" && styles.statusPending,
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
          </View>
        )}
      />
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
    statusSuccess: {
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      borderColor: "#10B981",
    },
    statusPending: {
      backgroundColor: "rgba(245, 158, 11, 0.15)",
      borderColor: "#F59E0B",
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
  });
