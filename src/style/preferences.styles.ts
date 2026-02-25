import { StyleSheet } from "react-native";
import { mainThemeColors } from "../theme";

export const createPreferencesStyles = (colors: typeof mainThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundMain,
    },
    content: {
      flex: 1,
    },
    section: {
      marginTop: 32,
      marginHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.grayLabelText,
      marginBottom: 12,
      marginLeft: 4,
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.backgroundCard,
    },
    optionRowSelected: {
      backgroundColor: colors.backgroundInput,
    },
    optionRowPressed: {
      opacity: 0.6,
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.backgroundInput,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: colors.borderLight,
    },
    iconContainerSelected: {
      backgroundColor: colors.primaryButton,
      borderColor: colors.primaryButton,
    },
    optionIcon: {
      fontSize: 22,
      color: colors.grayLabelText,
    },
    optionIconSelected: {
      color: "#ffffff",
    },
    textContainer: {
      flex: 1,
    },
    optionText: {
      fontSize: 17,
      fontWeight: "600",
      color: colors.textBody,
      letterSpacing: 0.2,
      marginBottom: 2,
    },
    optionTextSelected: {
      color: colors.primaryButton,
      fontWeight: "700",
    },
    optionDescription: {
      fontSize: 13,
      color: colors.grayPlaceholder,
      letterSpacing: 0.1,
    },
    checkmarkContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primaryButton,
      justifyContent: "center",
      alignItems: "center",
    },
    checkmark: {
      fontSize: 14,
      color: "#ffffff",
      fontWeight: "800",
    },
    separator: {
      height: 0.5,
      backgroundColor: colors.borderLight,
      marginLeft: 12,
      marginRight: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    infoLabel: {
      fontSize: 17,
      fontWeight: "500",
      color: colors.textBody,
    },
    infoValue: {
      fontSize: 17,
      color: colors.grayLabelText,
    },
  });
