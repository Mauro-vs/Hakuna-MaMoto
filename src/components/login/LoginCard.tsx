import React  from "react";
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import LoginIcon from "./loginIcon";
import { TextInput } from "react-native-paper";
import ButtonGeneral from "./button";

export const LoginCard = () => {
  return (
    <View style={s.viewCard}>
        {/* Inicio de la pantalla */}
        <LoginIcon />
        <Text style={s.titulo}>Bienvenido</Text>
        <Text style={s.subtitulo}>Introduce tus credenciales para continuar</Text>

        {/* Campos de entrada */}
        <Text style={s.inputText}>Correo Electrónico</Text>
        <TextInput
            mode="outlined"
            placeholder="nombre@ejemplo.com"
            placeholderTextColor="#b4b4b4"
            outlineColor="#dcdcdc"
            activeOutlineColor="#4f46e5"
            style={s.paperInput}
            left={<TextInput.Icon icon="email-outline" color="#b4b4b4" size={20} />}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15}}>
            <Text style={s.inputText}>Contraseña</Text>
            <Text style={s.inputTextPassword} onPress={() => {}}>¿Olvidaste tu contraseña?</Text>
        </View>
        <TextInput
            mode="outlined"
            placeholder="********   "
            secureTextEntry={true}
            placeholderTextColor="#b4b4b4"
            outlineColor="#dcdcdc"
            activeOutlineColor="#4f46e5"
            style={s.paperInput}
            left={<TextInput.Icon icon="lock-outline" color="#b4b4b4" size={20} />}
        />

        {/* Botón de inicio de sesión */}
        <ButtonGeneral />

        {/* Separador */}
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
            <View style={s.separatorLine} />
            <Text style={s.separatorText}>O continua con</Text>
            <View style={s.separatorLine} />
        </View>

        <View style={{height: 20}} /> {/* Espaciador */}

        {/* Botón de Google */}
        <Pressable style={s.buttonG}>
            <Image
                source={require('C:\\Users\\mauro\\Documents\\DAM-PmDm\\REACT\\myAppProject\\assets\\google.png')}
                style={{ width: 18, height: 18, marginRight: 10 }}
            />
            <Text style={{fontSize: 14, fontWeight: "bold", color: "#606060ff", alignSelf: "center"}}>Google</Text>
        </Pressable>

        <View style={{flexDirection: "row", alignSelf: "center", marginTop: 15}}>
            <Text style={[s.inputText, {fontWeight: "600"}]}>¿No tienes una cuenta? </Text>
            <Text style={s.inputTextPassword} onPress={() => {}}>Regístrate ahora</Text>
        </View>
    </View>
  );
};

// ESTILOS
const s = StyleSheet.create({
    viewCard: {
        width: 350,
        padding: 20,
        margin: 20,
        borderRadius: 10,
        backgroundColor: "#ffffff",
    },
     titulo: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        alignSelf: "center",
    },
    subtitulo: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    inputText: {
        fontSize: 14,
        color: "#606060ff",
        fontWeight: "700",
        marginBottom: 5,
    },
    inputTextPassword: {
        fontSize: 14,
        color: "#4f46e5",
        fontWeight: "700",
        marginBottom: 5,
    },
    paperInput: {
        height: 48,
        backgroundColor: "#f5f6fa",
        fontSize: 15,
    },
    buttonG: {
        height: 38,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#dcdcdc",
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 10,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#dcdcdc",
    },
    separatorText: {
        marginHorizontal: 10,
        color: "#777",
        fontSize: 14,
    },
});