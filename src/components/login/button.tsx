import { useRouter } from "expo-router";
import React, { use } from "react";
import { View,Text, StyleSheet, Pressable } from "react-native";
import { mainThemeColors } from "../../theme";

const ButtonGeneral = () => {
  const router = useRouter();
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
const s = StyleSheet.create({
  button: {
        marginTop: 30,
        backgroundColor: mainThemeColors.primaryButton,
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