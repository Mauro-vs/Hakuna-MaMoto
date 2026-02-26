import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useThemeColors } from "../store/preferencesStore";
import {
  useCliente,
  useClientesList,
  useDeleteCliente,
  useUpdateCliente,
} from "../hooks/useClientes";
import { useUserStore } from "../store/userStore";
import { reservasService } from "../services/reservasService";

export const useClienteDetalle = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);

  const colors = useThemeColors();
  const user = useUserStore((state) => state.user);
  const isAdmin = user?.rol === "ADMIN";
  const [editarVisible, setEditarVisible] = useState(false);
  const { data: cliente, isLoading, refetch } = useCliente(clientId);
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

  const handleDeleteCliente = async () => {
    if (!cliente) return;
    Alert.alert(
      "Eliminar Cliente",
      "¿Estás seguro de que deseas eliminar este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCliente.mutateAsync(cliente.id);
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

  const handleUpdateCliente = async (clienteActualizado: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  }) => {
    if (!cliente) return;
    await updateCliente.mutateAsync({
      id: cliente.id,
      data: {
        name: clienteActualizado.nombre,
        surname: clienteActualizado.apellido,
        email: clienteActualizado.email,
        phoneNumber: clienteActualizado.telefono,
      },
    });
  };

  const handleUpdateReservaEstado = async (
    codigoReserva: string,
    nuevoEstado: string,
  ) => {
    if (!isAdmin) {
      Alert.alert(
        "Acción no permitida",
        "Solo los administradores pueden cambiar el estado de las reservas.",
      );
      return;
    }

    if (!codigoReserva.trim()) return;

    try {
      await reservasService.updateEstadoReservaByCodigoAdmin(
        codigoReserva.trim(),
        nuevoEstado,
      );
      await refetch();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "No se pudo actualizar el estado de la reserva. Inténtalo de nuevo.",
      );
    }
  };

  return {
    colors,
    clientId,
    cliente,
    isLoading,
    isAdmin,
    existingEmails,
    editarVisible,
    setEditarVisible,
    handleDeleteCliente,
    handleUpdateCliente,
    handleUpdateReservaEstado,
  };
};
