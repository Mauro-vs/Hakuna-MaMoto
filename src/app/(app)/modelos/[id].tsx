import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useThemeColors } from "../../../store/preferencesStore";
import { useModelo } from "../../../hooks/useModelos";

export default function ModeloDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const modeloId = Number(id);
  const colors = useThemeColors();
  const s = createStyles(colors);
  const { data: modelo, isLoading } = useModelo(modeloId);

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

      <View style={s.content}>
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

        <TouchableOpacity
          style={s.reserveButton}
          onPress={() =>
            Alert.alert(
              "Reserva",
              "Dime a que pantalla de reserva quieres navegar y lo conecto.",
            )
          }
        >
          <Text style={s.reserveText}>Reservar</Text>
        </TouchableOpacity>
      </View>
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
      flex: 1,
      padding: 16,
      gap: 10,
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
    reserveText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },
  });
