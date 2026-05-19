export interface Booking {
  id: number;
  usuarioId: number;
  usuarioNombre?: string;
  servicioId: number;
  servicioNombre?: string;
  servicioPrecio?: number;
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  fechaCreacion: string;
  notas?: string;
}

export interface BookingFilters {
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
}