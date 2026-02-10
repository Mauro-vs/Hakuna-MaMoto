import type { Modelo } from "../data/Modelos";
import { supabase } from "./supabaseClient";

export const modelosService = {
  async getAllModelos(): Promise<Modelo[]> {
    const { data, error } = await supabase
      .from("modelos")
      .select(
        "id, marca_modelo, descripcion, cilindrada, precio_dia, imagen_url, activo",
      )
      .or("activo.is.null,activo.eq.true")
      .order("id", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id,
      marcaModelo: row.marca_modelo,
      descripcion: row.descripcion ?? null,
      cilindrada: row.cilindrada ?? null,
      precioDia: Number(row.precio_dia ?? 0),
      imagenUrl: row.imagen_url ?? null,
      activo: row.activo ?? null,
    }));
  },

  async getModeloById(id: number): Promise<Modelo | null> {
    const { data, error } = await supabase
      .from("modelos")
      .select(
        "id, marca_modelo, descripcion, cilindrada, precio_dia, imagen_url, activo",
      )
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      marcaModelo: data.marca_modelo,
      descripcion: data.descripcion ?? null,
      cilindrada: data.cilindrada ?? null,
      precioDia: Number(data.precio_dia ?? 0),
      imagenUrl: data.imagen_url ?? null,
      activo: data.activo ?? null,
    };
  },
};
