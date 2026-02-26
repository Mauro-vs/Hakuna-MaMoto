import { StyleSheet } from "react-native";
import { useThemeColors } from "../store/preferencesStore";

export type ClienteDetalleTheme = ReturnType<typeof useThemeColors>;

export const createClienteDetalleStyles = (colors: ClienteDetalleTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.backgroundCard,
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
    header: {
      alignItems: "center",
      marginBottom: 24,
      gap: 8,
    },
    name: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.textTitle,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      elevation: 3,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    value: {
      fontSize: 15,
      color: colors.textValue,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textTitle,
      marginBottom: 8,
    },
    pedidoCard: {
      backgroundColor: colors.backgroundMain,
      borderRadius: 12,
      padding: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    pedidoHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    pedidoTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.grayLabelText,
    },
    pedidoInfo: {
      flex: 1,
    },
    pedidoSubtitle: {
      fontSize: 12,
      color: colors.textValue,
      marginTop: 2,
    },
    pedidoStatusPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.borderMain,
      backgroundColor: colors.backgroundMain,
    },
    pedidoStatusText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.grayLabelText,
    },
    empty: {
      fontSize: 14,
      color: colors.grayPlaceholder,
      textAlign: "center",
    },
    emptyWrapper: {
      alignItems: "center",
      gap: 6,
    },
    deleteButton: {
      backgroundColor: colors.errorButton,
      paddingVertical: 14,
      borderRadius: 16,
      justifyContent: "center",
      marginRight: 15,
      marginLeft: 15,
      marginBottom: 15,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.errorBorder,
      shadowColor: colors.errorButton,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalCard: {
      width: "90%",
      maxWidth: 420,
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 4,
    },
    modalSubtitle: {
      fontSize: 13,
      color: colors.grayLabelText,
      marginBottom: 12,
    },
    modalOptions: {
      marginTop: 4,
      marginBottom: 12,
      gap: 6,
    },
    modalOption: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderMain,
      backgroundColor: colors.backgroundMain,
    },
    modalOptionActive: {
      borderColor: colors.primaryButton,
      backgroundColor: "rgba(37, 99, 235, 0.08)",
    },
    modalOptionText: {
      fontSize: 13,
      color: colors.textBody,
    },
    modalOptionTextActive: {
      fontWeight: "700",
      color: colors.primaryButton,
    },
    modalCancelButton: {
      marginTop: 4,
      alignSelf: "flex-end",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },
    modalCancelText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.grayLabelText,
    },
  });
