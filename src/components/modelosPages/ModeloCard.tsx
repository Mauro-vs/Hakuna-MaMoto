import React from "react";
import { Pressable, View, StyleSheet, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Modelo } from "../../data/Modelos";
import { useThemeColors } from "../../store/preferencesStore";

// NUEVO: Importamos el store de favoritos que hemos creado
import { useFavoritesStore } from "../../store/favoritesStore";

type ItemProps = {
  item: Modelo;
  isAdmin?: boolean;
  onEdit?: (item: Modelo) => void;
  onDelete?: (item: Modelo) => void;
};

export const ModeloCard: React.FC<ItemProps> = ({ item, isAdmin, onEdit, onDelete }) => {
  const colors = useThemeColors();
  const s = createStyles(colors);
  const priceLabel = `${item.precioDia.toFixed(2)} €/dia`;

  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  
  const isFavorite = favoriteIds.includes(item.id.toString());

  return (
    <Pressable
      style={({ pressed }) => [s.card, pressed && s.cardPressed]}
      onPress={() =>
        router.push({ pathname: "/(app)/modelos/[id]", params: { id: item.id } })
      }
    >
      <View style={s.mediaWrap}>
        
        <Pressable
          style={s.favoriteButton}
          onPress={(event) => {
            event.stopPropagation?.(); // Evita que se abra la pantalla de detalles al darle al corazón
            toggleFavorite(item.id.toString());
          }}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={isFavorite ? "#ff4757" : colors.textTitle} 
          />
        </Pressable>

        {isAdmin ? (
          <View style={s.adminActions}>
            <Pressable
              style={s.adminButton}
              onPress={(event) => {
                event.stopPropagation?.();
                onEdit?.(item);
              }}
            >
              <Ionicons name="create-outline" size={16} color={colors.textTitle} />
            </Pressable>
            <Pressable
              style={[s.adminButton, s.adminButtonDanger]}
              onPress={(event) => {
                event.stopPropagation?.();
                onDelete?.(item);
              }}
            >
              <Ionicons name="trash-outline" size={16} color={colors.errorText} />
            </Pressable>
          </View>
        ) : null}
        
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
      height: 200,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: colors.tabBackground,
      marginBottom: 12,
      position: "relative",
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
    favoriteButton: {
      position: "absolute",
      top: 8,
      left: 8,
      zIndex: 2,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.backgroundCard,
      borderWidth: 1,
      borderColor: colors.borderMain,
      alignItems: "center",
      justifyContent: "center",
    },
    adminActions: {
      position: "absolute",
      top: 8,
      right: 8,
      flexDirection: "row",
      gap: 8,
      zIndex: 2,
    },
    adminButton: {
      width: 30,
      height: 30,
      borderRadius: 8,
      backgroundColor: colors.backgroundCard,
      borderWidth: 1,
      borderColor: colors.borderMain,
      alignItems: "center",
      justifyContent: "center",
    },
    adminButtonDanger: {
      borderColor: colors.errorBorder,
    },
  });