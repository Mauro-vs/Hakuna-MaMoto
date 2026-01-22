import { Feather } from "@expo/vector-icons";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Cliente } from "../../data/Clientes";
import { useThemeColors } from "../../store/preferencesStore";

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    fab: {
      position: "absolute",
      bottom: 24,
      right: 24,
      backgroundColor: colors.primaryButton,
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      elevation: 6,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0)",
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    popup: {
      width: "100%",
      maxWidth: 380,
      backgroundColor: colors.backgroundCard,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
      textAlign: "center",
      color: colors.textTitle,
    },
    lblTitle: {
      fontSize: 16,
      color: colors.textValue,
      marginBottom: 6,
    },
    inputFondo: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.backgroundInput,
      borderColor: colors.inputBorder,
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
      gap: 8,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: colors.textInput,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 8,
    },
    cancelBtn: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    cancelText: {
      color: colors.grayLabelText,
      fontSize: 15,
    },
    saveBtn: {
      backgroundColor: colors.primaryButton,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 10,
    },
    saveText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "600",
    },
  });

export const PopUpCrear = ({
  visible,
  setVisible,
  onSave,
  existingClientes,
}: {
  visible: boolean;
  setVisible: (v: boolean) => void;
  onSave: (nuevoCliente: Cliente) => void;
  existingClientes: Cliente[];
}) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const colors = useThemeColors();
  const s = createStyles(colors);

  const handleSave = () => {
    if (!nombre || !apellido || !email) return;

    let newId = Math.floor(Math.random() * 1000);
    while (existingClientes.some((c) => c.id === newId)) {
      newId = Math.floor(Math.random() * 10000);
    }

    //Validaciones básicas
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[0-9]{9}$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, introduce un correo electrónico válido.");
      return;
    }
    if (telefono && !telefonoRegex.test(telefono)) {
      alert("Por favor, introduce un número de teléfono válido (formato: 600123456).");
      return;
    }

    //Validacion de duplicados
    if (existingClientes.some(c => c.email.toLowerCase() === email.toLowerCase())) {
      alert("Ya existe un cliente con este correo electrónico.");
      return;
    }

    // Creamos el nuevo cliente
    const nuevoCliente: Cliente = {
      id: newId,
      name: nombre,
      surname: apellido,
      email,
      phoneNumber: telefono,
      pedidos: [],
    };

    // Guardamos en el service
    onSave(nuevoCliente);

    // Limpiamos inputs y cerramos
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setVisible(false);
  };

  return (
    <>
      {/* Botón flotante */}
      <TouchableOpacity style={s.fab} onPress={() => setVisible(true)}>
        <Feather name="plus" size={26} color="white" />
      </TouchableOpacity>

      {/* Popup */}
      <Modal transparent animationType="fade" visible={visible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "transparent" }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Pressable style={s.overlay} onPress={() => setVisible(false)}>
              <Pressable style={s.popup} onPress={() => {}}>
                <Text style={s.title}>Nuevo cliente</Text>

              <Text style={s.lblTitle}>Nombre</Text>
              <View style={s.inputFondo}>
                <Feather name="user" size={18} color={colors.grayLabelText} />
                <TextInput
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Juan"
                  placeholderTextColor={colors.grayLabelText}
                  style={s.input}
                />
              </View>

              <Text style={s.lblTitle}>Apellido</Text>
              <View style={s.inputFondo}>
                <Feather name="user" size={18} color={colors.grayLabelText} />
                <TextInput
                  value={apellido}
                  onChangeText={setApellido}
                  placeholder="Pérez"
                  placeholderTextColor={colors.grayLabelText}
                  style={s.input}
                />
              </View>

              <Text style={s.lblTitle}>Correo electrónico</Text>
              <View style={s.inputFondo}>
                <Feather name="mail" size={18} color={colors.grayLabelText} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={colors.grayLabelText}
                  keyboardType="email-address"
                  style={s.input}
                />
              </View>

              <Text style={s.lblTitle}>Teléfono</Text>
              <View style={s.inputFondo}>
                <Feather name="phone" size={18} color={colors.grayLabelText} />
                <TextInput
                  value={telefono}
                  onChangeText={setTelefono}
                  placeholder="600 123 456"
                  placeholderTextColor={colors.grayLabelText}
                  keyboardType="phone-pad"
                  style={s.input}
                />
              </View>

              <View style={s.buttons}>
                <TouchableOpacity
                  style={s.cancelBtn}
                  onPress={() => setVisible(false)}
                >
                  <Text style={s.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                  <Text style={s.saveText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
