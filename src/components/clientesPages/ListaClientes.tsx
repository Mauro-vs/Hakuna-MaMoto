import React from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Cliente } from "../../data/Clientes";
import { useThemeColors } from "../../store/preferencesStore";

type ItemProps = { item: Cliente };

export const ListaClienteItem: React.FC<ItemProps> = ({ item }) => {
  const colors = useThemeColors();
  const s = createStyles(colors);

  return (
    <Pressable
      style={({ pressed }) => [
        s.tarjeta,
        pressed && s.tarjetaPres,
      ]}
      onPress={() => router.push({ pathname: "/(app)/clientes/[id]", params: { id: item.id } })}
    >
      
      <View style={s.cabecera}>
        <View style={s.avatar}>
          <Text style={s.avatarTx}>{item.name.charAt(0)}</Text>
        </View>
        <View style={s.info}>
          <Text style={s.nombre}>{item.name} {item.surname}</Text>
          <Text style={s.textoSecundario}>ID {item.id}</Text>
        </View>
      </View>
      <View style={s.pie}>
        <View style={s.fila}>
          <Feather name="mail" size={14} color={colors.textValue} style={s.icono} />
          <Text style={s.texto}>{item.email}</Text>
        </View>
        <View style={s.fila}>
          <Feather name="phone" size={14} color={colors.textValue} style={s.icono} />
          <Text style={s.texto}>{item.phoneNumber}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    tarjeta: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderLeftWidth: 3,
      borderLeftColor: colors.primaryButton,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    tarjetaPres: {
      opacity: 0.7,
    },
    cabecera: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.avatarBackground,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarTx: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.avatarText,
    },
    info: {
      flex: 1,
    },
    nombre: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textTitle,
    },
    textoSecundario: {
      fontSize: 11,
      color: colors.grayLabelText,
      marginTop: 2,
    },
    pie: {
      gap: 3,
      marginLeft: 48,
    },
    fila: {
      flexDirection: "row",
      alignItems: "center",
    },
    icono: {
      marginRight: 6,
    },
    texto: {
      fontSize: 12,
      color: colors.grayLabelText,
    },
  });
  