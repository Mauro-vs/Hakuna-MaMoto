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

export const useClienteDetalle = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clientId = Number(id);

  const colors = useThemeColors();
  const [editarVisible, setEditarVisible] = useState(false);
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

  return {
    colors,
    clientId,
    cliente,
    isLoading,
    existingEmails,
    editarVisible,
    setEditarVisible,
    handleDeleteCliente,
    handleUpdateCliente,
  };
};
