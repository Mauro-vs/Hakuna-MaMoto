import React from "react";
import { View,Text, StyleSheet, Pressable } from "react-native";

const ButtonGeneral = () => {
  return (
    <View>
        <Pressable style={s.button}><Text style={s.buttonText}>Iniciar Sesión</Text></Pressable>
    </View>
  )
}
// ESTILOS
const s = StyleSheet.create({
  button: {
        marginTop: 30,
        backgroundColor: "#4f46e5",
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