import { StyleSheet } from "react-native";
import { useThemeColors } from "../store/preferencesStore";

export type ModeloDetalleTheme = ReturnType<typeof useThemeColors>;

export const createModeloDetalleStyles = (colors: ModeloDetalleTheme) =>
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
      padding: 16,
      gap: 10,
      paddingBottom: 24,
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
    reserveButtonDisabled: {
      opacity: 0.6,
    },
    reserveText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "700",
    },
    formCard: {
      marginTop: 12,
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    formTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textTitle,
    },
    formHint: {
      fontSize: 12,
      color: colors.grayPlaceholder,
    },
    inputButton: {
      borderWidth: 1,
      borderColor: colors.borderMain,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: colors.backgroundMain,
    },
    inputText: {
      fontSize: 14,
      color: colors.textTitle,
    },
    inputPlaceholder: {
      fontSize: 14,
      color: colors.grayPlaceholder,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.borderMain,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.textTitle,
      backgroundColor: colors.backgroundMain,
    },
    inputNotes: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    summaryCard: {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.borderMain,
      backgroundColor: colors.tabBackground,
      gap: 4,
    },
    summaryTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 4,
    },
    summaryText: {
      fontSize: 12,
      color: colors.textBody,
    },
    infoCard: {
      marginTop: 12,
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    infoTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 6,
    },
    infoText: {
      fontSize: 13,
      color: colors.textBody,
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-start",
      paddingTop: 80,
      paddingHorizontal: 16,
    },
    modalCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderMain,
      overflow: "hidden",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMain,
    },
    modalTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textTitle,
    },
    modalAction: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primaryButton,
    },
  });
