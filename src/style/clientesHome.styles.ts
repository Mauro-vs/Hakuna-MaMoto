import { StyleSheet } from "react-native";
import { useThemeColors } from "../store/preferencesStore";

export type ClientesHomeTheme = ReturnType<typeof useThemeColors>;

export const createClientesHomeStyles = (colors: ClientesHomeTheme) =>
  StyleSheet.create({
    pantalla: {
      backgroundColor: colors.backgroundMain,
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    contenido: {
      paddingBottom: 12,
    },
    texto: {
      fontSize: 12,
      color: colors.grayLabelText,
    },
    listaVacia: {
      flexGrow: 1,
    },
    estadoVacio: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    textoVacio: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.grayLabelText,
    },
    sugerencia: {
      fontSize: 12,
      color: colors.grayPlaceholder,
    },
  });
