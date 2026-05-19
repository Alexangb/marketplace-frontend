import api from '../axios';

export interface Resena {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  usuarioFoto: string | null;
  servicioId: number;
  servicioNombre: string;
  calificacion: number;
  comentario: string;
  fecha: string;
  fechaFormateada: string;
  estrellas: string;
}

export interface ResenaCreate {
  usuarioId: number;
  servicioId: number;
  calificacion: number;
  comentario: string;
}

export const resenasApi = {
  // Obtener reseñas de un servicio
  getByServicio: async (servicioId: number): Promise<Resena[]> => {
    const response = await api.get(`/Resenas/servicio/${servicioId}`);
    return response.data.data || response.data;
  },

  // Obtener promedio de calificación de un servicio
  getPromedio: async (servicioId: number): Promise<number> => {
    const response = await api.get(`/Resenas/promedio/${servicioId}`);
    return response.data.data || response.data;
  },

  // Obtener distribución de calificaciones
  getDistribucion: async (servicioId: number): Promise<Record<number, number>> => {
    const response = await api.get(`/Resenas/distribucion/${servicioId}`);
    return response.data.data || response.data;
  },

  // Crear una reseña
  create: async (data: ResenaCreate): Promise<Resena> => {
    const response = await api.post('/Resenas', data);
    return response.data.data || response.data;
  },

  // Actualizar una reseña
  update: async (id: number, data: { calificacion: number; comentario: string }): Promise<void> => {
    await api.put(`/Resenas/${id}`, { id, ...data });
  },

  // Eliminar una reseña (solo admin)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Resenas/${id}`);
  },
};