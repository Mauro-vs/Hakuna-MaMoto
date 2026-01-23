import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useThemeColors } from "../../store/preferencesStore";

interface ButtonGeneralProps {
  onPress?: () => void;
  isLoading?: boolean;
}

const ButtonGeneral = ({ onPress, isLoading = false }: ButtonGeneralProps) => {
  const colors = useThemeColors();
  const s = createStyles(colors);

  return (
    <View>
        <Pressable style={[s.button, isLoading && s.buttonDisabled]} onPress={onPress} disabled={isLoading}>
          <Text style={s.buttonText}>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
        </Pressable>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    button: {
      marginTop: 30,
      backgroundColor: colors.primaryButton,
      paddingVertical: 12,
      borderRadius: 7,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    buttonDisabled: {
      opacity: 0.6,
    },
});

export default ButtonGeneral;