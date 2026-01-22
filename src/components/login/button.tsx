import { useRouter } from "expo-router";
import React from "react";
import { View,Text, StyleSheet, Pressable } from "react-native";
import { useThemeColors } from "../../store/preferencesStore";

const ButtonGeneral = () => {
  const router = useRouter();
  const colors = useThemeColors();
  const s = createStyles(colors);
  const handleLogin = () => {
    router.replace('/home');
  }
  return (
    <View>
        <Pressable style={s.button} onPress={handleLogin}><Text style={s.buttonText}>Iniciar Sesión</Text></Pressable>
    </View>
  )
}
  // ESTILOS
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
  });
export default  ButtonGeneral;