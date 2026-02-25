import { StyleSheet } from "react-native";
import { useThemeColors } from "../store/preferencesStore";

export type EditProfileTheme = ReturnType<typeof useThemeColors>;

export const createEditProfileStyles = (colors: EditProfileTheme) =>
  StyleSheet.create({
    screen: {
      backgroundColor: colors.backgroundMain,
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    userInfoCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      paddingVertical: 24,
      paddingHorizontal: 20,
      alignItems: "center",
      marginBottom: 28,
      borderWidth: 1,
      borderColor: colors.borderMain,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    avatarContainer: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: colors.primaryButton,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
      borderWidth: 2,
      borderColor: colors.borderMain,
    },
    avatarContainerPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
    avatarContainerDisabled: {
      opacity: 0.6,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: "800",
      color: "#fff",
    },
    avatarImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    avatarBadge: {
      position: "absolute",
      right: -2,
      bottom: -2,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primaryButton,
      borderWidth: 2,
      borderColor: colors.backgroundCard,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarHint: {
      fontSize: 12,
      color: colors.grayPlaceholder,
      fontWeight: "600",
      marginBottom: 8,
    },
    userName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 13,
      color: colors.textBody,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.grayPlaceholder,
      marginBottom: 16,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    formGroup: {
      marginBottom: 18,
    },
    label: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textTitle,
      marginBottom: 6,
    },
    hint: {
      fontSize: 12,
      color: colors.grayPlaceholder,
      marginBottom: 8,
      fontWeight: "500",
    },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: colors.textBody,
      fontSize: 14,
      backgroundColor: colors.backgroundCard,
    },
    disabledInput: {
      justifyContent: "center",
      backgroundColor: colors.tabBackground,
      borderColor: colors.borderMain,
    },
    saveButton: {
      marginTop: 8,
      backgroundColor: colors.primaryButton,
      paddingVertical: 14,
      borderRadius: 14,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    saveButtonPressed: {
      opacity: 0.9,
    },
    saveButtonDisabled: {
      opacity: 0.7,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "700",
    },
    cancelButton: {
      marginTop: 10,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.borderMain,
      alignItems: "center",
    },
    cancelButtonPressed: {
      opacity: 0.8,
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textBody,
    },
  });
