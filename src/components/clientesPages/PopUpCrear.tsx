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
} from "react-native";
import { useState } from "react";
import { Cliente } from "../../data/Clientes";

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

  const handleSave = () => {
    if (!nombre || !apellido || !email) return;

    let newId = Math.floor(Math.random() * 1000000);
    while (existingClientes.some((c) => c.id === newId)) {
      newId = Math.floor(Math.random() * 1000000);
    }

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
          style={{ flex: 1 }}
          keyboardVerticalOffset={1}
        >
          <Pressable style={s.overlay} onPress={() => setVisible(false)}>
            <Pressable style={s.popup}>
              <Text style={s.title}>Nuevo cliente</Text>

              <Text style={s.lblTitle}>Nombre</Text>
              <View style={s.inputFondo}>
                <Feather name="user" size={18} color="#9ca3af" />
                <TextInput
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Juan"
                  placeholderTextColor="#9ca3af"
                  style={s.input}
                />
              </View>

              <Text style={s.lblTitle}>Apellido</Text>
              <View style={s.inputFondo}>
                <Feather name="user" size={18} color="#9ca3af" />
                <TextInput
                  value={apellido}
                  onChangeText={setApellido}
                  placeholder="Pérez"
                  placeholderTextColor="#9ca3af"
                  style={s.input}
                />
              </View>

              <Text style={s.lblTitle}>Correo electrónico</Text>
              <View style={s.inputFondo}>
                <Feather name="mail" size={18} color="#9ca3af" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  style={s.input}
                />
              </View>

              <Text style={s.lblTitle}>Teléfono</Text>
              <View style={s.inputFondo}>
                <Feather name="phone" size={18} color="#9ca3af" />
                <TextInput
                  value={telefono}
                  onChangeText={setTelefono}
                  placeholder="600 123 456"
                  placeholderTextColor="#9ca3af"
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
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const s = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#2563eb",
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  popup: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  lblTitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 6,
  },
  inputFondo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
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
    color: "#6b7280",
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: "#2563eb",
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
