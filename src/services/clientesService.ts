import { Cliente, clientes } from "../data/Clientes";

let clientesDB: Cliente[] = [...clientes];

export const clientesService = {
  /** Devuelve todos los clientes (copia segura) */
  getAllClientes(): Cliente[] {
    return [...clientesDB];
  },

  /** Devuelve un cliente por id o null si no existe */
  getClienteById(id: number): Cliente | null {
    return clientesDB.find(c => c.id === id) ?? null;
  },

  /** Añade un cliente y genera el id automáticamente */
  addCliente(data: Omit<Cliente, "id">): Cliente {
    const newCliente: Cliente = {
      id: this.getNextId(),
      ...data,
    };
    clientesDB.push(newCliente);
    return newCliente;
  },

  /** Actualiza solo los campos indicados */
  updateCliente(
    id: number,
    data: Partial<Omit<Cliente, "id">>
  ): boolean {
    const index = clientesDB.findIndex(c => c.id === id);
    if (index === -1) return false;

    clientesDB[index] = {
      ...clientesDB[index],
      ...data,
    };
    return true;
  },

  /** Elimina un cliente por id */
  deleteCliente(id: number): boolean {
    const index = clientesDB.findIndex(c => c.id === id);
    if (index === -1) return false;

    clientesDB.splice(index, 1);
    return true;
  },

  /** Busca clientes por nombre, apellido o email */
  searchClientes(query: string): Cliente[] {
    const q = query.toLowerCase();
    return clientesDB.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.surname.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  },

  /** Comprueba si existe un cliente */
  exists(id: number): boolean {
    return clientesDB.some(c => c.id === id);
  },

  /** Genera el siguiente id disponible */
  getNextId(): number {
    return clientesDB.length
      ? Math.max(...clientesDB.map(c => c.id)) + 1
      : 1;
  },
};
