import React, { useMemo } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { Stack } from "expo-router";
import { useThemeColors } from "../../../store/preferencesStore";
import { ModeloCard } from "../../../components/modelosPages/ModeloCard";
import { createModelosFavoritosStyles } from "../../../style/modelosFavoritos.styles";
import { useModelosFavoritos } from "../../../hooks/useModelosFavoritos";

export default function FavoritosScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createModelosFavoritosStyles(colors), [colors]);
  const { isLoading, isError, favoritos } = useModelosFavoritos();

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
