import React  from "react";
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { TextInput } from "react-native-paper";
import LoginIcon from "./loginIcon";
import ButtonGeneral from "./button";

export const LoginCard = () => {
  return (
    <View style={{flex: 1, width: '80%', maxWidth: 400}}>
        <View style={{height: 100}} />

        {/* Inicio de la pantalla */}
        <LoginIcon />
        <Text style={styles.titulo}>Bienvenido</Text>
        <Text style={styles.subtitulo}>Introduce tus credenciales para continuar</Text>

        {/* Campos de entrada */}
        <Text style={styles.inputText}>Correo Electrónico</Text>
        <TextInput
            mode="outlined"
            placeholder="nombre@ejemplo.com"
            placeholderTextColor="#b4b4b4"
            outlineColor="#dcdcdc"
            activeOutlineColor="#4f46e5"
            style={styles.paperInput}
            left={<TextInput.Icon icon="email-outline" color="#b4b4b4" size={20} />}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15}}>
            <Text style={styles.inputText}>Contraseña</Text>
            <Text style={styles.inputTextPassword} onPress={() => {}}>¿Olvidaste tu contraseña?</Text>
        </View>
        <TextInput
            mode="outlined"
            placeholder="********"
            secureTextEntry={true}
            placeholderTextColor="#b4b4b4"
            outlineColor="#dcdcdc"
            activeOutlineColor="#4f46e5"
            style={styles.paperInput}
            left={<TextInput.Icon icon="lock-outline" color="#b4b4b4" size={20} />}
        />

        {/* Botón de inicio de sesión */}
        <ButtonGeneral />

        {/* Separador */}
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>O continua con</Text>
            <View style={styles.separatorLine} />
        </View>

        <View style={{height: 20}} />

        <Pressable style={styles.buttonG}>
            <Image
                source={require('C:\\Users\\mauro\\Documents\\DAM-PmDm\\REACT\\myAppProject\\assets\\google.png')}
                style={{ width: 18, height: 18, marginRight: 10 }}
            />
            <Text style={{fontSize: 14, fontWeight: "bold", color: "#606060ff", alignSelf: "center"}}>Google</Text>
        </Pressable>

        <View style={{flexDirection: "row", alignSelf: "center", marginTop: 15}}>
            <Text style={[styles.inputText, {fontWeight: "600"}]}>¿No tienes una cuenta? </Text>
            <Text style={styles.inputTextPassword} onPress={() => {}}>Regístrate ahora</Text>
        </View>
    </View>
  );
};

// ESTILOS
const styles = StyleSheet.create({
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
        height: 45,
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