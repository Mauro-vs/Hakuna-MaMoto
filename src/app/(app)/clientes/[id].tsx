import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Cliente } from "../../../data/Clientes";
import WinEmergenteEditar from "../../../components/clientesPages/WinEmergenteEditar";
import { useThemeColors } from "../../../store/preferencesStore";
import {
  useCliente,
  useClientesList,
  useDeleteCliente,
  useUpdateCliente,
} from "../../../hooks/useClientes";



export default function ClienteDetallado() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);
  const [editarVisible, setEditarVisible] = useState(false);
  const colors = useThemeColors();
  const s = createStyles(colors);
  const { data: cliente, isLoading } = useCliente(clientId);
  const { data: list } = useClientesList();
  const updateCliente = useUpdateCliente();
  const deleteCliente = useDeleteCliente();

  const existingEmails = useMemo(
    () =>
      (list ?? [])
        .filter((c) => c.id !== clientId)
        .map((c) => c.email)
        .filter((email): email is string => !!email),
    [list, clientId],
  );

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.primaryHeader} />
        <Text style={s.loadingText}>Cargando cliente...</Text>
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={s.center}>
        <Text style={s.error}>Cliente no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Stack.Screen
        options={{
          title: `Datos del Cliente: ${cliente.id}`,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/clientes")}
              style={{ padding: 12 }}
            >
              <Feather name="chevron-left" size={25} color={colors.headerText} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setEditarVisible(true)}
              style={{ padding: 12 }}
            >
              <Feather name="edit-2" size={20} color={colors.headerText} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Header */}
      <View style={s.header}>
        <Feather name="user" size={32} color={colors.iconMain} />
        <Text style={s.name}>
          {cliente.name} {cliente.surname}
        </Text>
      </View>

      {/* Card info */}
      <View style={s.card}>
        <View style={s.row}>
          <Feather name="mail" size={18} color={colors.grayLabelText} />
          <Text style={s.value}>{cliente.email}</Text>
        </View>

        <View style={s.row}>
          <Feather name="phone" size={18} color={colors.grayLabelText} />
          <Text style={s.value}>{cliente.phoneNumber}</Text>
        </View>
      </View>

      {/* Pedidos */}
      <Text style={s.sectionTitle}>Últimos pedidos</Text>

      <View style={s.card}>
        {(cliente.pedidos ?? []).length === 0 ? (
          <Text style={s.empty}>Este cliente no tiene pedidos</Text>
        ) : (
          (cliente.pedidos ?? []).map((p, i) => (
            <View key={i} style={s.pedido}>
              <Feather name="shopping-bag" size={16} color={colors.grayLabelText} />
              <Text style={s.pedidoText}>{p}</Text>
            </View>
          ))
        )}
      </View>

      {/* Boton para eliminar cliente */}
      <View>
        <TouchableOpacity
          style={s.deleteButton}
          onPress={() => {
            Alert.alert(
              "Eliminar Cliente",
              "¿Estás seguro de que deseas eliminar este cliente?",
              [
          { text: "Cancelar", onPress: () => {}, style: "cancel" },
          {
            text: "Eliminar",
            onPress: async () => {
              try {
                await deleteCliente.mutateAsync(cliente.id);
                router.push("/clientes");
              } catch (error) {
                Alert.alert("Error", "No se pudo eliminar el cliente");
                console.error(error);
              }
            },
            style: "destructive",
          },
              ]
            );
          }}>
          <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 16 }}>
            Eliminar Cliente
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de edición */}
      {editarVisible && (
        <WinEmergenteEditar
          cliente={{
            id: cliente.id,
            nombre: cliente.name,
            apellido: cliente.surname,
            email: cliente.email,
            telefono: cliente.phoneNumber,
          }}
          setVisible={setEditarVisible}
          existingEmails={existingEmails}
          onUpdate={async (clienteActualizado) => {
            await updateCliente.mutateAsync({
              id: cliente.id,
              data: {
                name: clienteActualizado.nombre,
                surname: clienteActualizado.apellido,
                email: clienteActualizado.email,
                phoneNumber: clienteActualizado.telefono,
              },
            });
          }}
          onDelete={async () => {
            await deleteCliente.mutateAsync(cliente.id);
          }}
        />
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.backgroundCard,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.backgroundMain,
    },

    loadingText: {
      marginTop: 12,
      color: colors.textValue,
    },

    error: {
      color: colors.errorText,
      fontSize: 16,
    },

    header: {
      alignItems: "center",
      marginBottom: 24,
      gap: 8,
    },

    name: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.textTitle,
    },

    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: 16,
      padding: 16,
      marginBottom: 20,
      elevation: 3,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },

    value: {
      fontSize: 15,
      color: colors.textValue,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textTitle,
      marginBottom: 8,
    },

    pedido: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
    },

    pedidoText: {
      fontSize: 14,
      color: colors.textValue,
    },

    empty: {
      fontSize: 14,
      color: colors.grayPlaceholder,
      textAlign: "center",
    },
    deleteButton: {
      backgroundColor: colors.errorButton,
      paddingVertical: 14,
      borderRadius: 16,
      justifyContent: "center",
      marginRight: 15,
      marginLeft: 15,
      marginBottom: 15,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.errorBorder,
      shadowColor: colors.errorButton,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
  });