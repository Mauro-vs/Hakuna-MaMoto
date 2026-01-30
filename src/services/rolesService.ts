import { supabase } from "./supabaseClient";
import type { Role, RoleName } from "../types/types";

const mapRole = (row: { id: string; nombre: string; descripcion?: string | null }): Role => ({
  id: row.id,
  name: row.nombre as RoleName,
  description: row.descripcion ?? undefined,
});

export const rolesService = {
  async getAll(): Promise<Role[]> {
    const { data, error } = await supabase
      .from("roles")
      .select("id, nombre, descripcion")
      .order("nombre", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapRole);
  },

  async getById(id: string): Promise<Role | null> {
    const { data, error } = await supabase
      .from("roles")
      .select("id, nombre, descripcion")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRole(data) : null;
  },

  async create(input: { name: RoleName; description?: string }): Promise<Role> {
    const { data, error } = await supabase
      .from("roles")
      .insert({ nombre: input.name, descripcion: input.description ?? null })
      .select("id, nombre, descripcion")
      .single();

    if (error) throw error;
    return mapRole(data);
  },

  async update(id: string, input: Partial<{ name: RoleName; description?: string }>): Promise<boolean> {
    const payload: { nombre?: RoleName; descripcion?: string | null } = {};
    if (input.name) payload.nombre = input.name;
    if (input.description !== undefined) payload.descripcion = input.description ?? null;

    const { error } = await supabase
      .from("roles")
      .update(payload)
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase.from("roles").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
