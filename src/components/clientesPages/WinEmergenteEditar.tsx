import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { clientesService } from "../../services/clientesService";

interface ClienteInfo {
  cliente: {
    id: number; // Add this line
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  setVisible: (v: boolean) => void; // Para cerrar el modal desde el padre
  onGuardar: (clienteActualizado: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  }) => void; // Para actualizar el cliente
}

export default function WinEmergenteEditar({
  cliente,
  setVisible,
  onGuardar,
}: ClienteInfo) {
  const [modalVisible, setModalVisible] = useState(true);
  const [clienteEdit, setClienteEdit] = useState(cliente);

  // Si el modal se cierra desde fuera, mantener sincronizado
  useEffect(() => {
    setClienteEdit(cliente);
  }, [cliente]);

  const handleDelete = () => {
    console.log("Cliente eliminado");
  };

  const handleAceptar = () => {
    try {
      // Llamar al service para actualizar el cliente
      clientesService.updateCliente(cliente.id, clienteEdit);
      // Notificar al padre
      onGuardar(clienteEdit);
      setModalVisible(false);
      setVisible(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el cliente");
      console.error(error);
    }
  };

  const handleCancelar = () => {
    setModalVisible(false);
    setVisible(false);
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={s.modalBackground}>
        <View style={s.modalContainer}>
          {/* Encabezado */}
          <View style={s.header}>
            <Text style={s.headerText}>Modo de edición</Text>
            <TouchableOpacity onPress={handleDelete}>
              <Feather name="trash-2" size={24} color="red" />
            </TouchableOpacity>
          </View>

          {/* Formulario */}
          <View style={s.form}>
            <Text style={s.textLabel}>Nombre:</Text>
            <TextInput
              style={s.input}
              value={clienteEdit.nombre}
              onChangeText={(text) =>
                setClienteEdit({ ...clienteEdit, nombre: text })
              }
            />
            <Text style={s.textLabel}>Apellidos:</Text>
            <TextInput
              style={s.input}
              value={clienteEdit.apellido}
              onChangeText={(text) =>
                setClienteEdit({ ...clienteEdit, apellido: text })
              }
            />
            <Text style={s.textLabel}>Email:</Text>
            <TextInput
              style={s.input}
              value={clienteEdit.email}
              onChangeText={(text) =>
                setClienteEdit({ ...clienteEdit, email: text })
              }
              keyboardType="email-address"
            />
            <Text style={s.textLabel}>Teléfono:</Text>
            <TextInput
              style={s.input}
              value={clienteEdit.telefono}
              onChangeText={(text) =>
                setClienteEdit({ ...clienteEdit, telefono: text })
              }
              keyboardType="phone-pad"
            />
          </View>

          {/* Botones */}
          <View style={s.buttons}>
            <TouchableOpacity style={s.cancelButton} onPress={handleCancelar}>
              <Text style={s.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.acceptButton} onPress={handleAceptar}>
              <Text style={s.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    width: "100%",
    maxWidth: 480,
    height: "75%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },
  form: {
    flex: 1,
    marginBottom: 25,
  },
  textLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    marginLeft: 12,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#2196F3",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    backgroundColor: "#fefefe",
    fontSize: 16,
    color: "#222",
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ff9292",
    paddingVertical: 14,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#f32121",
    shadowColor: "#ff9292",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    marginLeft: 10,
    backgroundColor: "#2196F3",
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
