import { useQuery } from "@tanstack/react-query";
import { modelosService } from "../services/modelosService";

const modelosKeys = {
  all: ["modelos"] as const,
  lists: () => [...modelosKeys.all, "list"] as const,
  detail: (id: number) => [...modelosKeys.all, "detail", id] as const,
};

export function useModelosList() {
  return useQuery({
    queryKey: modelosKeys.lists(),
    queryFn: () => modelosService.getAllModelos(),
  });
}

export function useModelo(id: number) {
  return useQuery({
    queryKey: modelosKeys.detail(id),
    queryFn: () => modelosService.getModeloById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}
