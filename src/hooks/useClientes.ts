import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientesService } from "../services/clientesService";
import type { Cliente } from "../data/Clientes";

const clientesKeys = {
  all: ["clientes"] as const,
  lists: () => [...clientesKeys.all, "list"] as const,
  detail: (id: number) => [...clientesKeys.all, "detail", id] as const,
};

export function useClientesList() {
  return useQuery({
    queryKey: clientesKeys.lists(),
    queryFn: () => clientesService.getAllClientes(),
  });
}

export function useCliente(id: number) {
  return useQuery({
    queryKey: clientesKeys.detail(id),
    queryFn: () => clientesService.getClienteById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Cliente, "id">) => clientesService.addCliente(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; data: Partial<Omit<Cliente, "id">> }) =>
      clientesService.updateCliente(payload.id, payload.data),
    onSuccess: (_result, payload) => {
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientesKeys.detail(payload.id) });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clientesService.deleteCliente(id),
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: clientesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientesKeys.detail(id) });
    },
  });
}
