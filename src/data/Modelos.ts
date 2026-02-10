export interface Modelo {
  id: number;
  marcaModelo: string;
  descripcion?: string | null;
  cilindrada?: string | null;
  precioDia: number;
  imagenUrl?: string | null;
  activo?: boolean | null;
}
