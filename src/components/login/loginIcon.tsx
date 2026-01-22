import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useThemeColors } from "../../store/preferencesStore";

const LockIcon = () => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Feather name="lock" size={24} color={colors.primaryButton} />
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      width: 50,
      height: 50,
      marginBottom: 20,
      borderRadius: 25, // La mitad del ancho/alto para hacerlo circular
      backgroundColor: colors.backgroundInput,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: 'center',
    },
});

export default LockIcon;