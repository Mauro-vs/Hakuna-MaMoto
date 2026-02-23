import { supabase } from "./supabaseClient";

const buildCodigoReserva = () => `RES-${Date.now().toString(36).toUpperCase()}`;

const toDateOnly = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
};

const calcDias = (inicio: Date, fin: Date) => {
  const diff = fin.getTime() - inicio.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const reservasService = {
  async createReserva(input: {
    usuarioId: string;
    email: string;
    nombre?: string;
    modeloId: number;
    precioDia: number;
    fechaInicio: string;
    fechaFin: string;
    notas?: string;
  }): Promise<number> {
    const inicio = toDateOnly(input.fechaInicio);
    const fin = toDateOnly(input.fechaFin);

    if (!inicio || !fin) {
      throw new Error("Fechas invalidas. Usa el formato AAAA-MM-DD");
    }

    const dias = calcDias(inicio, fin);
    if (dias <= 0) {
      throw new Error("La fecha de fin debe ser posterior a la de inicio");
    }

    const { data: clienteData, error: clienteError } = await supabase
      .from("clientes")
      .select("id")
      .ilike("email", input.email)
      .maybeSingle();

    let clienteId = clienteData?.id ?? null;

    if (clienteError) throw clienteError;

    if (!clienteId) {
      const { data: nuevoCliente, error: insertError } = await supabase
        .from("clientes")
        .insert({
          nombre: input.nombre?.trim() || input.email,
          email: input.email,
        })
        .select("id")
        .single();

      if (insertError || !nuevoCliente) {
        throw (
          insertError || new Error("No se ha podido crear el cliente asociado")
        );
      }

      clienteId = nuevoCliente.id;
    }

    const { data: reserva, error: reservaError } = await supabase
      .from("reservas")
      .insert({
        codigo_reserva: buildCodigoReserva(),
        cliente_id: clienteId,
        fecha_inicio: inicio.toISOString(),
        fecha_fin: fin.toISOString(),
        notas_cliente: input.notas ?? null,
        estado: "PREPARADA",
        usuario_id: input.usuarioId,
      })
      .select("id")
      .single();

    if (reservaError || !reserva) {
      throw reservaError || new Error("No se ha podido crear la reserva");
    }

    const { error: lineaError } = await supabase.from("lineas_reserva").insert({
      reserva_id: reserva.id,
      modelo_id: input.modeloId,
      precio_dia_pactado: input.precioDia,
      dias,
      cantidad: 1,
    });

    if (lineaError) throw lineaError;

    return reserva.id;
  },

  async updateEstadoReserva(
    id: number,
    usuarioId: string,
    nuevoEstado: string,
  ) {
    const { error } = await supabase
      .from("reservas")
      .update({ estado: nuevoEstado })
      .eq("id", id)
      .eq("usuario_id", usuarioId);

    if (error) throw error;
  },

  async updateFechasReserva(
    id: number,
    usuarioId: string,
    fechaInicio: string,
    fechaFin: string,
  ) {
    const inicio = toDateOnly(fechaInicio);
    const fin = toDateOnly(fechaFin);

    if (!inicio || !fin) {
      throw new Error("Fechas invalidas. Usa el formato AAAA-MM-DD");
    }

    const dias = calcDias(inicio, fin);
    if (dias <= 0) {
      throw new Error("La fecha de fin debe ser posterior a la de inicio");
    }

    const { error } = await supabase
      .from("reservas")
      .update({
        fecha_inicio: inicio.toISOString(),
        fecha_fin: fin.toISOString(),
      })
      .eq("id", id)
      .eq("usuario_id", usuarioId);

    if (error) throw error;

    const { error: lineasError } = await supabase
      .from("lineas_reserva")
      .update({ dias })
      .eq("reserva_id", id);

    if (lineasError) throw lineasError;
  },

  async listByUsuario(usuarioId: string) {
    const { data, error } = await supabase
      .from("reservas")
      .select(
        `
        id,
        codigo_reserva,
        fecha_inicio,
        fecha_fin,
        estado,
        created_at,
        notas_cliente,
        lineas_reserva(
          dias,
          precio_dia_pactado,
          modelos(marca_modelo)
        )
      `,
      )
      .eq("usuario_id", usuarioId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },
};
