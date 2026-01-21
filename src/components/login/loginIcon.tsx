import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { mainThemeColors } from "../../theme";

const LockIcon = () => {
  return (
    <View style={styles.container}>
      <Feather name="lock" size={24} color={mainThemeColors.primaryButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    marginBottom: 20,
    borderRadius: 25, // La mitad del ancho/alto para hacerlo circular
    backgroundColor: mainThemeColors.backgroundInput, // Color de fondo lavanda claro
    justifyContent: "center", // Centra el icono verticalmente
    alignItems: "center", // Centra el icono horizontalmente
    alignSelf: 'center',
  },
});

export default LockIcon;