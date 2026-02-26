import React, { useMemo, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Modal, Pressable } from "react-native";
import { router, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import WinEmergenteEditar from "../../../components/clientesPages/WinEmergenteEditar";
import { useThemeColors } from "../../../store/preferencesStore";
import { createClienteDetalleStyles } from "../../../style/clienteDetalle.styles";
import { useClienteDetalle } from "../../../hooks/useClienteDetalle";



export default function ClienteDetallado() {
  const colors = useThemeColors();
  const s = useMemo(() => createClienteDetalleStyles(colors), [colors]);
  const {
    cliente,
    isLoading,
    isAdmin,
    existingEmails,
    editarVisible,
    setEditarVisible,
    handleDeleteCliente,
    handleUpdateCliente,
    handleUpdateReservaEstado,
  } = useClienteDetalle();

  const [estadoModalVisible, setEstadoModalVisible] = useState(false);
  const [selectedReservaCodigo, setSelectedReservaCodigo] = useState<string | null>(null);
  const [selectedReservaEstado, setSelectedReservaEstado] = useState<string | null>(null);

  const ESTADOS_RESERVA = [
    "PREPARADA",
    "ENTREGADA",
    "DEVUELTA",
    "REVISION",
    "FINALIZADA",
    "CANCELADA",
  ] as const;

  const openEstadoModal = (codigoReserva: string, estadoActual: string) => {
    if (!isAdmin) return;
    setSelectedReservaCodigo(codigoReserva);
    setSelectedReservaEstado(estadoActual);
    setEstadoModalVisible(true);
  };

  const handleSelectNuevoEstado = async (nuevoEstado: string) => {
    if (!selectedReservaCodigo || nuevoEstado === selectedReservaEstado) {
      setEstadoModalVisible(false);
      return;
    }

    await handleUpdateReservaEstado(selectedReservaCodigo, nuevoEstado);
    setEstadoModalVisible(false);
  };

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
            const codigoTexto = codigoRaw || "Reserva";
            const codigoReserva = codigoTexto.replace(/^Reserva\s*/i, "").trim();
            const rango = rangoRaw || "";
            const estado = estadoRaw || "";

            const statusPill = !!estado && (
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
            );

            return (
              <View key={i} style={s.pedidoCard}>
                <View style={s.pedidoHeader}>
                  <Feather name="shopping-bag" size={18} color={colors.iconMain} />
                  <View style={s.pedidoInfo}>
                    <Text style={s.pedidoTitle}>{codigoTexto}</Text>
                    {!!rango && <Text style={s.pedidoSubtitle}>{rango}</Text>}
                  </View>
                  {isAdmin && codigoReserva ? (
                    <TouchableOpacity
                      onPress={() => openEstadoModal(codigoReserva, estado)}
                      activeOpacity={0.8}
                    >
                      {statusPill}
                    </TouchableOpacity>
                  ) : (
                    statusPill
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

      {isAdmin && estadoModalVisible && (
        <Modal
          transparent
          animationType="fade"
          visible={estadoModalVisible}
          onRequestClose={() => setEstadoModalVisible(false)}
        >
          <Pressable
            style={s.modalBackdrop}
            onPress={() => setEstadoModalVisible(false)}
          />
          <View style={s.modalContainer}>
            <View style={s.modalCard}>
              <Text style={s.modalTitle}>Cambiar estado de la reserva</Text>
              <Text style={s.modalSubtitle}>
                Código: {selectedReservaCodigo ?? "-"}
              </Text>

              <View style={s.modalOptions}>
                {ESTADOS_RESERVA.map((estado) => {
                  const isActive = estado === selectedReservaEstado;
                  return (
                    <TouchableOpacity
                      key={estado}
                      style={[
                        s.modalOption,
                        isActive && s.modalOptionActive,
                      ]}
                      onPress={() => handleSelectNuevoEstado(estado)}
                    >
                      <Text
                        style={[
                          s.modalOptionText,
                          isActive && s.modalOptionTextActive,
                        ]}
                      >
                        {estado}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={s.modalCancelButton}
                onPress={() => setEstadoModalVisible(false)}
              >
                <Text style={s.modalCancelText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

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
