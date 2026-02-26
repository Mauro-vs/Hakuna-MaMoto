import { useMemo, useState } from "react";
import { Redirect } from "expo-router";
import { useThemeColors } from "../store/preferencesStore";
import { useUserStore } from "../store/userStore";
import { useClientesList, useCreateCliente } from "./useClientes";
import type { Cliente } from "../data/Clientes";

export const useClientesHome = () => {
  const colors = useThemeColors();
  const user = useUserStore((state) => state.user);
  const [visible, setVisible] = useState(false);
  const { data, isLoading, isError } = useClientesList();
  const createCliente = useCreateCliente();

  const list: Cliente[] = useMemo(() => data ?? [], [data]);
  const shouldRedirectHome = user?.rol === "NORMAL";

  const handleSave = async (nuevoCliente: Omit<Cliente, "id">) => {
    try {
      const creado = await createCliente.mutateAsync(nuevoCliente);
      return creado;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return {
    colors,
    user,
    visible,
    setVisible,
    list,
    isLoading,
    isError,
    shouldRedirectHome,
    handleSave,
  };
};
