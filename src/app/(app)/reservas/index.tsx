import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
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
  const [reservas, setReservas] = useState<Array<{ id: number; codigo_reserva: string; fecha_inicio: string; fecha_fin: string; estado: string }>>([]);

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
            <Text style={styles.headerTitle}>Resumen</Text>
            <Text style={styles.headerSubtitle}>Total: {reservas.length} reservas</Text>
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
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes reservas aun</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.code}>{item.codigo_reserva}</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>{item.estado}</Text>
              </View>
            </View>
            <Text style={styles.meta}>Inicio: {item.fecha_inicio.slice(0, 10)}</Text>
            <Text style={styles.meta}>Fin: {item.fecha_fin.slice(0, 10)}</Text>
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
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 6,
    },
    code: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textTitle,
    },
    meta: {
      fontSize: 12,
      color: colors.grayLabelText,
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
    emptyContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      color: colors.grayPlaceholder,
      fontSize: 14,
    },
  });
