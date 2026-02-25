import { StyleSheet } from "react-native";
import { useThemeColors } from "../store/preferencesStore";

export type ModelosTheme = ReturnType<typeof useThemeColors>;

export const createModelosStyles = (colors: ModelosTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.backgroundMain,
      paddingHorizontal: 16,
      paddingVertical: 12,
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
      paddingTop: 4,
      paddingBottom: 20,
    },
    listEmpty: {
      flexGrow: 1,
    },
    searchSection: {
      marginBottom: 10,
      padding: 10,
      borderRadius: 12,
      backgroundColor: colors.backgroundCard,
      borderWidth: 1,
      borderColor: colors.borderMain,
      gap: 8,
    },
    searchInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 50,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.backgroundInputPopup,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 2,
      fontSize: 13,
      color: colors.textTitle,
    },
    filtersRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 50,
      backgroundColor: colors.tabBackground,
    },
    filterChipActive: {
      backgroundColor: colors.primaryButton,
    },
    filterChipText: {
      fontSize: 12,
      color: colors.textBody,
    },
    filterChipTextActive: {
      color: "#ffffff",
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 40,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textTitle,
    },
    emptyDesc: {
      fontSize: 13,
      color: colors.grayPlaceholder,
      textAlign: "center",
      paddingHorizontal: 24,
    },
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      backgroundColor: colors.primaryButton,
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      elevation: 4,
      shadowColor: colors.primaryButton,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    modalWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalCard: {
      width: "92%",
      maxWidth: 460,
      backgroundColor: colors.backgroundCard,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 12,
    },
    modalContent: {
      paddingBottom: 12,
      gap: 10,
    },
    label: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.borderMain,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 14,
      color: colors.textTitle,
      backgroundColor: colors.backgroundMain,
    },
    inputMultiline: {
      minHeight: 72,
      textAlignVertical: "top",
    },
    imagePreviewWrap: {
      marginTop: 6,
      marginBottom: 6,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.borderMain,
    },
    imagePreview: {
      width: "100%",
      height: 140,
      resizeMode: "cover",
    },
    imageActionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    imageButton: {
      flex: 1,
      backgroundColor: colors.primaryButton,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    imageButtonDisabled: {
      opacity: 0.7,
    },
    imageButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#fff",
    },
    imageClearButton: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderMain,
      backgroundColor: colors.backgroundMain,
    },
    imageClearText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textBody,
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
      marginTop: 8,
    },
    cancelButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderMain,
      backgroundColor: colors.backgroundMain,
    },
    cancelText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textBody,
    },
    saveButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: colors.primaryButton,
    },
    saveButtonDisabled: {
      opacity: 0.7,
    },
    saveText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#fff",
    },
  });
