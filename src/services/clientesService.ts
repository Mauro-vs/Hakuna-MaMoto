import type { Cliente } from "../data/Clientes";
import { supabase } from "./supabaseClient";

export const clientesService = {
  /** Devuelve todos los clientes */
  async getAllClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombre, apellidos, email, telefono")
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.nombre,
      surname: row.apellidos ?? "",
      email: row.email,
      phoneNumber: row.telefono ?? "",
      pedidos: [],
    }));
  },

  /** Devuelve un cliente por id o null si no existe */
  async getClienteById(id: number): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombre, apellidos, email, telefono")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return {
      id: data.id,
      name: data.nombre,
      surname: data.apellidos ?? "",
      email: data.email,
      phoneNumber: data.telefono ?? "",
      pedidos: [],
    } as Cliente;
  },

  /** Añade un cliente */
  async addCliente(data: Omit<Cliente, "id">): Promise<Cliente> {
    const payload = {
      nombre: data.name,
      apellidos: data.surname,
      email: data.email,
      telefono: data.phoneNumber,
    };

    const { data: inserted, error } = await supabase
      .from("clientes")
      .insert(payload)
      .select("id, nombre, apellidos, email, telefono")
      .single();

    if (error) throw error;
    return {
      id: inserted.id,
      name: inserted.nombre,
      surname: inserted.apellidos ?? "",
      email: inserted.email,
      phoneNumber: inserted.telefono ?? "",
      pedidos: [],
    } as Cliente;
  },

  /** Actualiza solo los campos indicados */
  async updateCliente(
    id: number,
    data: Partial<Omit<Cliente, "id">>
  ): Promise<boolean> {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.nombre = data.name;
    if (data.surname !== undefined) payload.apellidos = data.surname;
    if (data.email !== undefined) payload.email = data.email;
    if (data.phoneNumber !== undefined) payload.telefono = data.phoneNumber;

    const { error } = await supabase
      .from("clientes")
      .update(payload)
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  /** Elimina un cliente por id */
  async deleteCliente(id: number): Promise<boolean> {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  /** Busca clientes por nombre, apellido o email */
  async searchClientes(query: string): Promise<Cliente[]> {
    const q = `%${query}%`;
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombre, apellidos, email, telefono")
      .or(`nombre.ilike.${q},apellidos.ilike.${q},email.ilike.${q}`)
      .order("id", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.nombre,
      surname: row.apellidos ?? "",
      email: row.email,
      phoneNumber: row.telefono ?? "",
      pedidos: [],
    }));
  },

  /** Comprueba si existe un cliente */
  async exists(id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from("clientes")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};
