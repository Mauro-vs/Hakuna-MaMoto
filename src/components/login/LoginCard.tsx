import React, { useState }  from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { TextInput } from "react-native-paper";
import LoginIcon from "./loginIcon";
import ButtonGeneral from "./button";
import { useThemeColors } from "../../store/preferencesStore";
import { useAuth } from "../../context/AuthContext";
import { useUserStore } from "../../store/userStore";

export const LoginCard = () => {
        const colors = useThemeColors();
        const styles = createStyles(colors);
    const { login, register } = useAuth();
        const setUser = useUserStore((state) => state.setUser);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
        const [loading, setLoading] = useState(false);

        const handleLogin = async () => {
            if (!email || !password) {
                Alert.alert("Error", "Completa email y contraseña");
                return;
            }
            try {
                setLoading(true);
                const user = await login(email, password);
                setUser(user);
            } catch (err) {
                console.log(err);
                Alert.alert("Error de login", err instanceof Error ? err.message : "Error");
            } finally {
                setLoading(false);
            }
        };

        const handleRegister = async () => {
            if (!nombre.trim()) {
                Alert.alert("Error", "Completa tu nombre");
                return;
            }
            if (!email || !password || !confirmPassword) {
                Alert.alert("Error", "Completa todos los campos");
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert("Error", "Las contraseñas no coinciden");
                return;
            }
            try {
                setLoading(true);
                const result = await register(email, password, nombre.trim());
                if (result.needsEmailConfirmation) {
                    Alert.alert(
                        "Revisa tu correo",
                        "Te hemos enviado un email para confirmar tu cuenta.",
                    );
                    setIsRegistering(false);
                    setPassword("");
                    setConfirmPassword("");
                    return;
                }
                setUser(result.user);
            } catch (err) {
                console.log(err);
                Alert.alert("Error de registro", err instanceof Error ? err.message : "Error");
            } finally {
                setLoading(false);
            }
        };

  return (
    <View style={{flex: 1, width: '80%', maxWidth: 400}}>
        <View style={{height: 100}} />

        {/* Inicio de la pantalla */}
        <LoginIcon />
                <Text style={styles.titulo}>{isRegistering ? "Crea tu cuenta" : "Bienvenido"}</Text>
                <Text style={styles.subtitulo}>
                        {isRegistering
                            ? "Completa tus datos para registrarte"
                            : "Introduce tus credenciales para continuar"}
                </Text>

        {/* Campos de entrada */}
        {isRegistering && (
            <>
                <Text style={styles.inputText}>Nombre</Text>
                <TextInput
                    mode="flat"
                    placeholder="Tu nombre"
                    placeholderTextColor={colors.inputPlaceholder}
                    textColor={colors.textBody}
                    underlineColor={colors.borderMain}
                    activeUnderlineColor={colors.borderLight}
                    selectionColor={colors.primaryButton}
                    style={styles.paperInput}
                    value={nombre}
                    onChangeText={setNombre}
                    editable={!loading}
                    left={<TextInput.Icon icon="account-outline" color={colors.inputPlaceholder} size={20} />}
                />
                <View style={{height: 10}} />
            </>
        )}

        <Text style={styles.inputText}>Correo Electronico</Text>
        <TextInput
            mode="flat"
            placeholder="nombre@ejemplo.com"
            placeholderTextColor={colors.inputPlaceholder}
            textColor={colors.textBody}
            underlineColor={colors.borderMain}
            activeUnderlineColor={colors.borderLight}
            selectionColor={colors.primaryButton}
            style={styles.paperInput}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            left={<TextInput.Icon icon="email-outline" color={colors.inputPlaceholder} size={20} />}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15}}>
            <Text style={styles.inputText}>Contrasena</Text>
            {!isRegistering && (
                <Text style={styles.inputTextPassword} onPress={() => {}}>¿Olvidaste tu contraseña?</Text>
            )}
        </View>
        <TextInput
            mode="flat"
            placeholder="********"
            secureTextEntry={true}
            placeholderTextColor={colors.inputPlaceholder}
            textColor={colors.textBody}
            underlineColor={colors.borderMain}
            activeUnderlineColor={colors.borderLight}
            selectionColor={colors.primaryButton}
            style={styles.paperInput}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            left={<TextInput.Icon icon="lock-outline" color={colors.inputPlaceholder} size={20} />}
        />

        {isRegistering && (
            <>
                <View style={{height: 10}} />
                <Text style={styles.inputText}>Confirmar contrasena</Text>
                <TextInput
                    mode="flat"
                    placeholder="********"
                    secureTextEntry={true}
                    placeholderTextColor={colors.inputPlaceholder}
                    textColor={colors.textBody}
                    underlineColor={colors.borderMain}
                    activeUnderlineColor={colors.borderLight}
                    selectionColor={colors.primaryButton}
                    style={styles.paperInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!loading}
                    left={<TextInput.Icon icon="lock-outline" color={colors.inputPlaceholder} size={20} />}
                />
            </>
        )}

        {/* Botón de inicio de sesión */}
        <ButtonGeneral
            onPress={isRegistering ? handleRegister : handleLogin}
            isLoading={loading}
            label={isRegistering ? "Crear cuenta" : "Iniciar sesion"}
            loadingLabel={isRegistering ? "Registrando..." : "Iniciando..."}
        />

        {/* Separador */}
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>O continua con</Text>
            <View style={styles.separatorLine} />
        </View>

        <View style={{height: 20}} />

        <Pressable style={styles.buttonG}>
            <Image
                source={require('../../../assets/google.png')}
                style={{ width: 18, height: 18, marginRight: 10 }}
            />
            <Text style={{fontSize: 14, fontWeight: "bold", color: colors.textTitle, alignSelf: "center"}}>Google</Text>
        </Pressable>

        <View style={{flexDirection: "row", alignSelf: "center", marginTop: 15}}>
            <Text style={[styles.inputText, {fontWeight: "600"}]}>
                {isRegistering ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
            </Text>
            <Text
                style={styles.inputTextPassword}
                onPress={() => setIsRegistering((prev) => !prev)}
            >
                {isRegistering ? "Inicia sesion" : "Registrate ahora"}
            </Text>
        </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
     titulo: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        alignSelf: "center",
        color: colors.textTitle,
    },
    subtitulo: {
        fontSize: 12,
        textAlign: "center",
        color: colors.secondaryLink,
        marginBottom: 20,
    },
    inputText: {
        fontSize: 14,
        color: colors.textInput,
        fontWeight: "700",
        marginBottom: 5,
    },
    inputTextPassword: {
        fontSize: 14,
        color: colors.secondaryLink,
        fontWeight: "700",
        marginBottom: 5,
    },
    paperInput: {
        height: 48,
        backgroundColor: colors.backgroundInput,
        fontSize: 15,
    },
    buttonG: {
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.backgroundCard,
        borderWidth: 1,
        borderColor: colors.borderMain,
        borderRadius: 8,
        paddingVertical: 12,
        marginTop: 10,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.borderMain,
    },
    separatorText: {
        marginHorizontal: 10,
        color: colors.textSeparator,
        fontSize: 14,
    },
});