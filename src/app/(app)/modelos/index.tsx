import React from "react";
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { useThemeColors } from "../../../store/preferencesStore";
import { useModelosList } from "../../../hooks/useModelos";
import { ModeloCard } from "../../../components/modelosPages/ModeloCard";

export default function ModelosScreen() {
  const colors = useThemeColors();
  const s = createStyles(colors);
  const { data, isLoading, isError } = useModelosList();
  const list = data ?? [];

  if (isLoading) {
    return (
      <View style={[s.screen, s.center]}>
        <ActivityIndicator size="large" color={colors.primaryButton} />
        <Text style={s.statusText}>Cargando modelos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[s.screen, s.center]}>
        <Text style={s.errorText}>Error cargando modelos</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Modelos" }} />
      <View style={s.screen}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ModeloCard item={item} />}
          contentContainerStyle={list.length === 0 ? s.listEmpty : s.listContent}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Text style={s.emptyTitle}>No hay modelos disponibles</Text>
              <Text style={s.emptyDesc}>Agrega modelos en tu base de datos</Text>
            </View>
          }
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
      color: colors.grayLabelText,
    },
    errorText: {
      color: colors.errorText,
    },
    listContent: {
      paddingBottom: 12,
    },
    listEmpty: {
      flexGrow: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.grayLabelText,
    },
    emptyDesc: {
      fontSize: 12,
      color: colors.grayPlaceholder,
    },
  });
