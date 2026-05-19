import api from '../axios';
import { Booking, BookingFilters } from '@/types/booking';

export const bookingsApi = {
  // Obtener reservas del usuario actual
  getMisReservas: async (): Promise<Booking[]> => {
    const response = await api.get('/reservas/usuario');
    return response.data.data || response.data;
  },

  // Obtener reservas por ID de usuario
  getByUsuario: async (usuarioId: number): Promise<Booking[]> => {
    const response = await api.get(`/reservas/usuario/${usuarioId}`);
    return response.data.data || response.data;
  },

  // Obtener reserva por ID
  getById: async (id: number): Promise<Booking> => {
    const response = await api.get(`/reservas/${id}`);
    return response.data.data || response.data;
  },

  // Cancelar reserva
  cancelar: async (id: number, motivo?: string): Promise<void> => {
    await api.patch(`/reservas/${id}/cancelar`, { motivo });
  },

  // Confirmar reserva (para profesionales)
  confirmar: async (id: number): Promise<void> => {
    await api.patch(`/reservas/${id}/confirmar`);
  },

  // Completar reserva (para profesionales)
  completar: async (id: number): Promise<void> => {
    await api.patch(`/reservas/${id}/completar`);
  },

  // Obtener reservas por fecha
  getByFecha: async (fecha: string): Promise<Booking[]> => {
    const response = await api.get(`/reservas/fecha/${fecha}`);
    return response.data.data || response.data;
  },

  // Obtener reservas con filtros
  getWithFilters: async (filtros: BookingFilters): Promise<Booking[]> => {
    const response = await api.get('/reservas/filtrar', { params: filtros });
    return response.data.data || response.data;
  },
  
  getByServicio: async (servicioId: number): Promise<Booking[]> => {
  const response = await api.get(`/reservas/servicio/${servicioId}`);
  return response.data.data || response.data;
},
};