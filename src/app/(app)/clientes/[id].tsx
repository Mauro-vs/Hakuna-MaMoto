import React, { useEffect, useState } from "react";
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
import { clientesService } from "../../../services/clientesService";
import WinEmergenteEditar from "../../../components/clientesPages/WinEmergenteEditar";
import { mainThemeColors } from "../../../theme";

export default function ClienteDetallado() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [editarVisible, setEditarVisible] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setCargando(true);
      const c = clientesService.getClienteById(clientId);
      if (mounted) {
        setCliente(c || null);
        setCargando(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [clientId]);

  const handleGuardar = (clienteActualizado: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  }) => {
    // Actualizamos los datos en el estado del padre
    if (cliente) {
      setCliente({
        ...cliente,
        name: clienteActualizado.nombre,
        surname: clienteActualizado.apellido,
        email: clienteActualizado.email,
        phoneNumber: clienteActualizado.telefono,
      });
    }
  };

  if (cargando) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={mainThemeColors.primaryBlue} />
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
    <ScrollView contentContainerStyle={s.container}>
      <Stack.Screen
        options={{
          title: `Datos del Cliente: ${cliente.id}`,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/clientes")}
              style={{ padding: 12 }}
            >
              <Feather name="chevron-left" size={25} color="#ffffff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setEditarVisible(true)}
              style={{ padding: 12 }}
            >
              <Feather name="edit-2" size={20} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Header */}
      <View style={s.header}>
        <Feather name="user" size={32} color={mainThemeColors.primaryBlue} />
        <Text style={s.name}>
          {cliente.name} {cliente.surname}
        </Text>
      </View>

      {/* Card info */}
      <View style={s.card}>
        <View style={s.row}>
          <Feather name="mail" size={18} color={mainThemeColors.grayLabel} />
          <Text style={s.value}>{cliente.email}</Text>
        </View>

        <View style={s.row}>
          <Feather name="phone" size={18} color={mainThemeColors.grayLabel} />
          <Text style={s.value}>{cliente.phoneNumber}</Text>
        </View>
      </View>

      {/* Pedidos */}
      <Text style={s.sectionTitle}>Últimos pedidos</Text>

      <View style={s.card}>
        {cliente.pedidos.length === 0 ? (
          <Text style={s.empty}>Este cliente no tiene pedidos</Text>
        ) : (
          cliente.pedidos.map((p, i) => (
            <View key={i} style={s.pedido}>
              <Feather name="shopping-bag" size={16} color={mainThemeColors.primaryBlue} />
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
              clientesService.deleteCliente(cliente.id);
              router.push("/clientes");
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
          onGuardar={handleGuardar} // Pasa la función para actualizar el cliente
        />
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: mainThemeColors.bgLight,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: mainThemeColors.grayLabel,
  },

  error: {
    color: mainThemeColors.errorRed,
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
    color: mainThemeColors.textDarkMain,
  },

  card: {
    backgroundColor: mainThemeColors.cardBg,
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
    color: mainThemeColors.textMedium,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: mainThemeColors.textDarkMain,
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
    color: mainThemeColors.textMedium,
  },

  empty: {
    fontSize: 14,
    color: mainThemeColors.grayText,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: mainThemeColors.dangerRed,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: mainThemeColors.dangerRedDark,
    shadowColor: mainThemeColors.dangerRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
