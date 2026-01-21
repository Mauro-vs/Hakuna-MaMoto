import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { clientesService } from "../../services/clientesService";
import { router } from "expo-router";
import { mainThemeColors } from "../../theme";

interface ClienteInfo {
  cliente: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  setVisible: (v: boolean) => void;
  onGuardar: (clienteActualizado: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  }) => void;
}

export default function WinEmergenteEditar({
  cliente,
  setVisible,
  onGuardar,
}: ClienteInfo) {
  const [modalVisible, setModalVisible] = useState(true);
  const [clienteEdit, setClienteEdit] = useState(cliente);

  useEffect(() => {
    setClienteEdit(cliente);
  }, [cliente]);

  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            try {
              clientesService.deleteCliente(cliente.id);
              onGuardar({
                nombre: "",
                apellido: "",
                email: "",
                telefono: "",
              });
              setModalVisible(false);
              setVisible(false);
              router.push("/clientes");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el cliente");
              console.error(error);
            }
          },
        },
      ],
    );
  };

  const handleAceptar = () => {
    try {
      if (!clienteEdit.nombre || !clienteEdit.apellido || !clienteEdit.email) {
        Alert.alert("Error", "Nombre, Apellidos y Email son obligatorios");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const telefonoRegex = /^[0-9]{9}$/;

      // Validacion de email
      if (!emailRegex.test(clienteEdit.email)) {
        Alert.alert("Error", "Introduce un correo válido");
        return;
      }
      // Validacion de duplicados
      const clientesExistentes = clientesService.getAllClientes();
      if (
        clientesExistentes.some(
          (c) =>
            c.id !== cliente.id &&
            c.email.toLowerCase() === clienteEdit.email.toLowerCase(),
        )
      ) {
        Alert.alert(
          "Error",
          "Ya existe un cliente con este correo electrónico.",
        );
        return;
      }
      // Validacion de telefono
      // Teléfono es opcional
      if (clienteEdit.telefono && !telefonoRegex.test(clienteEdit.telefono)) {
        Alert.alert("Error", "Teléfono inválido (9 dígitos)");
        return;
      }

      clientesService.updateCliente(cliente.id, clienteEdit);
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
    <Modal visible={modalVisible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
        contentContainerStyle={{ flexGrow: 1 }}
        enabled
      >
        <View style={s.modalBackground}>
          <View style={s.modalContainer}>

            {/* Header */}
            <View style={s.header}>
              <Text style={s.headerText}>Modo de edición</Text>
              <TouchableOpacity onPress={handleDelete}>
                <Feather name="trash-2" size={24} color="red" />
              </TouchableOpacity>
            </View>

            {/* Formulario */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={s.form}>
                <Text style={s.textLabel}>Nombre</Text>
                <TextInput
                  style={s.input}
                  value={clienteEdit.nombre}
                  onChangeText={(text) =>
                    setClienteEdit({ ...clienteEdit, nombre: text })
                  }
                  returnKeyType="next"
                />

                <Text style={s.textLabel}>Apellidos</Text>
                <TextInput
                  style={s.input}
                  value={clienteEdit.apellido}
                  onChangeText={(text) =>
                    setClienteEdit({ ...clienteEdit, apellido: text })
                  }
                  returnKeyType="next"
                />

                <Text style={s.textLabel}>Email</Text>
                <TextInput
                  style={s.input}
                  value={clienteEdit.email}
                  onChangeText={(text) =>
                    setClienteEdit({ ...clienteEdit, email: text })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />

                <Text style={s.textLabel}>Teléfono</Text>
                <TextInput
                  style={s.input}
                  value={clienteEdit.telefono}
                  onChangeText={(text) =>
                    setClienteEdit({ ...clienteEdit, telefono: text })
                  }
                  keyboardType="phone-pad"
                  returnKeyType="done"
                />
              </View>
            </ScrollView>

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
      </KeyboardAvoidingView>
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
    backgroundColor: mainThemeColors.backgroundCard,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: mainThemeColors.inputBorder,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: mainThemeColors.textTitle,
  },
  form: {
    flexGrow: 1,
  },
  textLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    marginLeft: 12,
    color: mainThemeColors.textValue,
  },
  input: {
    borderWidth: 1,
    borderColor: mainThemeColors.inputBorder,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    backgroundColor: mainThemeColors.inputBackground,
    fontSize: 16,
    color: mainThemeColors.textInput,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: mainThemeColors.errorButton,
    borderColor: mainThemeColors.errorBorder,
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 25,
    marginRight: 10,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    marginLeft: 10,
    backgroundColor: mainThemeColors.inputBorder,
    borderColor: mainThemeColors.textTitle,
    borderWidth: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
