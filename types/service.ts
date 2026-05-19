export interface Service {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
  categoriaId: number;
  categoriaNombre?: string;
  usuarioId: number;
  usuarioNombre?: string;
  estado: boolean;
  fechaCreacion: string;
  precioFormateado: string;
  duracionFormateada: string;
}

export interface ServiceCreate {
  nombre: string;
  descripcion?: string;
  precio: number;
  duracionMinutos: number;
  categoriaId: number;
  usuarioId: number;
}

export interface ServiceFilters {
  nombre?: string;
  categoriaId?: number;
  precioMin?: number;
  precioMax?: number;
  fecha?: string;
  hora?: string;
}