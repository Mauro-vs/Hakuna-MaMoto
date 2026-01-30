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
import { router } from "expo-router";
import { useThemeColors } from "../../store/preferencesStore";

interface ClienteInfo {
  cliente: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  setVisible: (v: boolean) => void;
  existingEmails?: string[];
  onUpdate: (clienteActualizado: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function WinEmergenteEditar({
  cliente,
  setVisible,
  onUpdate,
  onDelete,
  existingEmails,
}: ClienteInfo) {
  const [modalVisible, setModalVisible] = useState(true);
  const [clienteEdit, setClienteEdit] = useState(cliente);
  const colors = useThemeColors();
  const s = createStyles(colors);

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
          onPress: async () => {
            try {
              await onDelete();
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

  const handleAceptar = async () => {
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
      if (
        existingEmails?.some(
          (email) => email.toLowerCase() === clienteEdit.email.toLowerCase(),
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

      await onUpdate(clienteEdit);
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              style={{ flexGrow: 1 }}
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

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalContainer: {
      width: "100%",
      maxWidth: "100%",
      height: "75%",
      backgroundColor: colors.backgroundCard,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 30,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: colors.inputBorder,
      paddingBottom: 10,
    },
    headerText: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.textTitle,
    },
    form: {
      flexGrow: 1,
    },
    textLabel: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 6,
      marginLeft: 12,
      color: colors.textValue,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      borderRadius: 20,
      paddingVertical: 14,
      paddingHorizontal: 18,
      marginBottom: 20,
      backgroundColor: colors.inputBackground,
      fontSize: 16,
      color: colors.textInput,
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.errorButton,
      borderColor: colors.errorBorder,
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
      backgroundColor: colors.inputBorder,
      borderColor: colors.textTitle,
      borderWidth: 2,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
      textAlign: "center",
    },
  });