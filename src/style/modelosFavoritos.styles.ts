import { StyleSheet } from "react-native";
import { useThemeColors } from "../store/preferencesStore";

export type ModelosFavoritosTheme = ReturnType<typeof useThemeColors>;

export const createModelosFavoritosStyles = (colors: ModelosFavoritosTheme) =>
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
