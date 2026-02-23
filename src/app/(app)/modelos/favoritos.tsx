import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Stack } from "expo-router";
import { useThemeColors } from "../../../store/preferencesStore";
import { useModelosList } from "../../../hooks/useModelos";
import { useFavoritesStore } from "../../../store/favoritesStore";
import { ModeloCard } from "../../../components/modelosPages/ModeloCard";
import type { Modelo } from "../../../data/Modelos";

export default function FavoritosScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { data, isLoading, isError } = useModelosList();
  const { favoriteIds, loadFavorites } = useFavoritesStore();

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const modelos: Modelo[] = data ?? [];
  const favoritos = modelos.filter((m) => favoriteIds.includes(m.id.toString()));

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color={colors.primaryButton} />
        <Text style={styles.statusText}>Cargando tus favoritos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.errorText}>No se pudieron cargar los favoritos</Text>
      </View>
    );
  }

  if (favoritos.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: "Favoritos" }} />
        <View style={[styles.screen, styles.center]}>
          <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
          <Text style={styles.emptyDesc}>
            Toca el corazón en una moto para guardarla aquí.
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Favoritos" }} />
      <View style={styles.screen}>
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ModeloCard item={item} />}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
      color: colors.textBody,
    },
    errorText: {
      color: colors.errorText,
    },
    listContent: {
      paddingBottom: 12,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textBody,
      marginBottom: 4,
      textAlign: "center",
    },
    emptyDesc: {
      fontSize: 13,
      color: colors.grayPlaceholder,
      textAlign: "center",
    },
  });
