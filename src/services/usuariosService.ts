import { supabase } from "./supabaseClient";
import type { User } from "../types/types";

const mapUsuario = (row: {
  id: string;
  rol: string;
  nombre: string;
  email: string;
  avatar_url?: string | null;
  activo?: boolean | null;
}): User => ({
  id: row.id,
  rol: row.rol as User["rol"],
  name: row.nombre,
  email: row.email,
  avatarUrl: row.avatar_url ?? undefined,
  activo: row.activo ?? undefined,
});

export const usuariosService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, rol, nombre, email, avatar_url, activo")
      .order("nombre", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapUsuario);
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, rol, nombre, email, avatar_url, activo")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapUsuario(data) : null;
  },

  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, rol, nombre, email, avatar_url, activo")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    return data ? mapUsuario(data) : null;
  },

  async create(input: Omit<User, "id">): Promise<User> {
    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        rol: input.rol,
        nombre: input.name,
        email: input.email,
        avatar_url: input.avatarUrl ?? null,
        activo: input.activo ?? true,
      })
      .select("id, rol, nombre, email, avatar_url, activo")
      .single();

    if (error) throw error;
    return mapUsuario(data);
  },

  async update(id: string, input: Partial<Omit<User, "id">>): Promise<boolean> {
    const payload: Record<string, unknown> = {};
    if (input.name) payload.nombre = input.name;
    if (input.email) payload.email = input.email;
    if (input.avatarUrl !== undefined)
      payload.avatar_url = input.avatarUrl ?? null;
    if (input.activo !== undefined) payload.activo = input.activo;

    if (input.email) {
      const { data, error: errorAuth } = await supabase.auth.updateUser({
        email: payload.email as string,
      });

      if (errorAuth) throw errorAuth;
    }

    const { error } = await supabase
      .from("usuarios")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    return true;
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase.from("usuarios").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
