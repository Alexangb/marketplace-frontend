import api from '../axios';
import { Service, ServiceCreate, ServiceFilters } from '@/types/service';

export const servicesApi = {
  // Obtener servicios activos para el home
  getAllActive: async (): Promise<Service[]> => {
    const response = await api.get('/Servicios');
    // Asegurar que la respuesta tenga el formato correcto
    const services = response.data.data || response.data;
    return services.map((s: any) => ({
      ...s,
      precioFormateado: `$${s.precio}`,
      duracionFormateada: `${s.duracionMinutos} min`,
    }));
  },

  // Obtener servicio por ID
  getById: async (id: number): Promise<Service> => {
    const response = await api.get(`/Servicios/${id}`);
    const service = response.data.data || response.data;
    return {
      ...service,
      precioFormateado: `$${service.precio}`,
      duracionFormateada: `${service.duracionMinutos} min`,
    };
  },

  // Obtener servicios por categoría
  getByCategoria: async (categoriaId: number): Promise<Service[]> => {
    const response = await api.get(`/Servicios/Categoria/${categoriaId}`);
    const services = response.data.data || response.data;
    return services.map((s: any) => ({
      ...s,
      precioFormateado: `$${s.precio}`,
      duracionFormateada: `${s.duracionMinutos} min`,
    }));
  },

  // Obtener servicios por prestador (para dashboard)
  getByPrestador: async (usuarioId: number): Promise<Service[]> => {
    const response = await api.get(`/Servicios/Prestador/${usuarioId}`);
    const services = response.data.data || response.data;
    return services.map((s: any) => ({
      ...s,
      precioFormateado: `$${s.precio}`,
      duracionFormateada: `${s.duracionMinutos} min`,
    }));
  },

  // Búsqueda avanzada
  buscarAvanzado: async (filtros: ServiceFilters): Promise<Service[]> => {
    const response = await api.get('/Servicios/Buscar', { params: filtros });
    const services = response.data.data || response.data;
    return services.map((s: any) => ({
      ...s,
      precioFormateado: `$${s.precio}`,
      duracionFormateada: `${s.duracionMinutos} min`,
    }));
  },

  // Crear servicio
  create: async (data: ServiceCreate): Promise<Service> => {
    const response = await api.post('/Servicios', data);
    const service = response.data.data || response.data;
    return {
      ...service,
      precioFormateado: `$${service.precio}`,
      duracionFormateada: `${service.duracionMinutos} min`,
    };
  },

  // Actualizar servicio
  update: async (id: number, data: Partial<ServiceCreate> & { estado: boolean }): Promise<void> => {
    await api.put(`/Servicios/${id}`, { ...data, id });
  },

  // Eliminar servicio
  delete: async (id: number): Promise<void> => {
    await api.delete(`/Servicios/${id}`);
  },

  // Cambiar estado (activar/desactivar)
  toggleStatus: async (id: number, estado: boolean): Promise<void> => {
    await api.patch(`/Servicios/${id}/status?estado=${estado}`);
  },
};