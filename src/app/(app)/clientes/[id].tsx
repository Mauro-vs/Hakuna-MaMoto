import React, { useMemo } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import WinEmergenteEditar from "../../../components/clientesPages/WinEmergenteEditar";
import { useThemeColors } from "../../../store/preferencesStore";
import { createClienteDetalleStyles } from "../../../style/clienteDetalle.styles";
import { useClienteDetalle } from "../../../useControllers/useClienteDetalle";



export default function ClienteDetallado() {
  const colors = useThemeColors();
  const s = useMemo(() => createClienteDetalleStyles(colors), [colors]);
  const {
    cliente,
    isLoading,
    existingEmails,
    editarVisible,
    setEditarVisible,
    handleDeleteCliente,
    handleUpdateCliente,
  } = useClienteDetalle();

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

      {/* Reservas del cliente */}
      <Text style={s.sectionTitle}>Reservas recientes</Text>

      <View style={s.card}>
        {(cliente.pedidos ?? []).length === 0 ? (
          <View style={s.emptyWrapper}>
            <Feather name="calendar" size={18} color={colors.grayPlaceholder} />
            <Text style={s.empty}>Este cliente no tiene reservas</Text>
          </View>
        ) : (
          (cliente.pedidos ?? []).map((p, i) => {
            const [codigoRaw, rangoRaw, estadoRaw] = p.split("·").map((t) => t.trim());
            const codigo = codigoRaw || "Reserva";
            const rango = rangoRaw || "";
            const estado = estadoRaw || "";

            return (
              <View key={i} style={s.pedidoCard}>
                <View style={s.pedidoHeader}>
                  <Feather name="shopping-bag" size={18} color={colors.iconMain} />
                  <View style={s.pedidoInfo}>
                    <Text style={s.pedidoTitle}>{codigo}</Text>
                    {!!rango && <Text style={s.pedidoSubtitle}>{rango}</Text>}
                  </View>
                  {!!estado && (
                    <View
                      style={[
                        s.pedidoStatusPill,
                        estado === "PREPARADA" && { backgroundColor: "rgba(59, 130, 246, 0.15)", borderColor: "#3B82F6" },
                        estado === "ENTREGADA" && { backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: "#10B981" },
                        estado === "DEVUELTA" && { backgroundColor: "rgba(37, 99, 235, 0.12)", borderColor: "#2563EB" },
                        estado === "REVISION" && { backgroundColor: "rgba(245, 158, 11, 0.15)", borderColor: "#F59E0B" },
                        estado === "FINALIZADA" && { backgroundColor: "rgba(22, 163, 74, 0.18)", borderColor: "#16A34A" },
                        estado === "CANCELADA" && { backgroundColor: colors.errorButton, borderColor: colors.errorBorder },
                      ]}
                    >
                      <Text style={s.pedidoStatusText}>{estado}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Boton para eliminar cliente */}
      <View>
        <TouchableOpacity
          style={s.deleteButton}
          onPress={handleDeleteCliente}>
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
            await handleUpdateCliente(clienteActualizado);
          }}
          onDelete={async () => {
            await handleDeleteCliente();
          }}
        />
      )}
    </View>
  );
}
