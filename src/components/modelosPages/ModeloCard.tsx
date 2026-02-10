import React from "react";
import { Pressable, View, StyleSheet, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Modelo } from "../../data/Modelos";
import { useThemeColors } from "../../store/preferencesStore";

type ItemProps = { item: Modelo };

export const ModeloCard: React.FC<ItemProps> = ({ item }) => {
  const colors = useThemeColors();
  const s = createStyles(colors);
  const priceLabel = `${item.precioDia.toFixed(2)} €/dia`;

  return (
    <Pressable
      style={({ pressed }) => [s.card, pressed && s.cardPressed]}
      onPress={() =>
        router.push({ pathname: "/(app)/modelos/[id]", params: { id: item.id } })
      }
    >
      <View style={s.mediaWrap}>
        {item.imagenUrl ? (
          <Image source={{ uri: item.imagenUrl }} style={s.image} />
        ) : (
          <View style={s.placeholder}>
            <Ionicons name="image-outline" size={28} color={colors.grayLabelText} />
            <Text style={s.placeholderText}>Sin imagen</Text>
          </View>
        )}
      </View>

      <View style={s.info}>
        <Text style={s.title}>{item.marcaModelo}</Text>
        {item.descripcion ? <Text style={s.subtitle}>{item.descripcion}</Text> : null}
        <View style={s.metaRow}>
          {item.cilindrada ? (
            <View style={s.metaItem}>
              <Ionicons name="speedometer-outline" size={14} color={colors.grayLabelText} />
              <Text style={s.metaText}>{item.cilindrada}</Text>
            </View>
          ) : null}
          <View style={s.metaItem}>
            <Ionicons name="cash-outline" size={14} color={colors.grayLabelText} />
            <Text style={s.metaText}>{priceLabel}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      padding: 14,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.borderMain,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    cardPressed: {
      opacity: 0.85,
    },
    mediaWrap: {
      height: 160,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.tabBackground,
      marginBottom: 12,
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    placeholder: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    placeholderText: {
      fontSize: 12,
      color: colors.grayLabelText,
    },
    info: {
      gap: 6,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textTitle,
    },
    subtitle: {
      fontSize: 13,
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
      gap: 6,
      backgroundColor: colors.backgroundMain,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    metaText: {
      fontSize: 12,
      color: colors.grayLabelText,
      fontWeight: "600",
    },
  });
