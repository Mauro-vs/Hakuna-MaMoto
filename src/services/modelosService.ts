import type { Modelo } from "../data/Modelos";
import { supabase } from "./supabaseClient";

const toPublicImageUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const { data } = supabase.storage.from("motos").getPublicUrl(trimmed);
  return data.publicUrl;
};

const normalizeImageInput = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const modelosService = {
  async getAllModelos(): Promise<Modelo[]> {
    const { data, error } = await supabase
      .from("modelos")
      .select(
        "id, marca_modelo, descripcion, cilindrada, precio_dia, imagen_url, activo",
      )
      .or("activo.is.null,activo.eq.true")
      .order("precio_dia", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id,
      marcaModelo: row.marca_modelo,
      descripcion: row.descripcion ?? null,
      cilindrada: row.cilindrada ?? null,
      precioDia: Number(row.precio_dia ?? 0),
      imagenUrl: toPublicImageUrl(row.imagen_url),
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
      imagenUrl: toPublicImageUrl(data.imagen_url),
      activo: data.activo ?? null,
    };
  },

  async createModelo(input: {
    marcaModelo: string;
    descripcion?: string | null;
    cilindrada?: string | null;
    precioDia: number;
    imagenUrl?: string | null;
  }): Promise<Modelo> {
    const payload = {
      marca_modelo: input.marcaModelo,
      descripcion: input.descripcion ?? null,
      cilindrada: input.cilindrada ?? null,
      precio_dia: input.precioDia,
      imagen_url: normalizeImageInput(input.imagenUrl),
      activo: true,
    };

    const { data, error } = await supabase
      .from("modelos")
      .insert(payload)
      .select(
        "id, marca_modelo, descripcion, cilindrada, precio_dia, imagen_url, activo",
      )
      .single();

    if (error || !data) throw error || new Error("No se pudo crear el modelo");

    return {
      id: data.id,
      marcaModelo: data.marca_modelo,
      descripcion: data.descripcion ?? null,
      cilindrada: data.cilindrada ?? null,
      precioDia: Number(data.precio_dia ?? 0),
      imagenUrl: toPublicImageUrl(data.imagen_url),
      activo: data.activo ?? null,
    };
  },

  async updateModelo(
    id: number,
    input: Partial<{
      marcaModelo: string;
      descripcion?: string | null;
      cilindrada?: string | null;
      precioDia: number;
      imagenUrl?: string | null;
      activo?: boolean | null;
    }>,
  ): Promise<boolean> {
    const payload: Record<string, unknown> = {};
    if (input.marcaModelo !== undefined)
      payload.marca_modelo = input.marcaModelo;
    if (input.descripcion !== undefined)
      payload.descripcion = input.descripcion ?? null;
    if (input.cilindrada !== undefined)
      payload.cilindrada = input.cilindrada ?? null;
    if (input.precioDia !== undefined) payload.precio_dia = input.precioDia;
    if (input.imagenUrl !== undefined)
      payload.imagen_url = normalizeImageInput(input.imagenUrl);
    if (input.activo !== undefined) payload.activo = input.activo;

    const { error } = await supabase
      .from("modelos")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
    return true;
  },

  async softDeleteModelo(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("modelos")
      .update({ activo: false })
      .eq("id", id);

    if (error) throw error;
    return true;
  },
};
