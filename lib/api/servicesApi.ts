import api from '../axios';
import { Service, ServiceCreate, ServiceFilters } from '@/types/service';

export const servicesApi = {
  getAllActive: async (): Promise<Service[]> => {
    const response = await api.get('/servicios');
    const services = response.data.data || response.data;
    return services.map((s: any) => ({
      ...s,
      precioFormateado: `$${s.precio}`,
      duracionFormateada: `${s.duracionMinutos} min`,
    }));
  },

  getById: async (id: number): Promise<Service> => {
    const response = await api.get(`/servicios/${id}`);
    const service = response.data.data || response.data;
    return {
      ...service,
      precioFormateado: `$${service.precio}`,
      duracionFormateada: `${service.duracionMinutos} min`,
    };
  },

  getByCategoria: async (categoriaId: number): Promise<Service[]> => {
    const response = await api.get(`/servicios/categoria/${categoriaId}`);
    const services = response.data.data || response.data;
    return services.map((s: any) => ({
      ...s,
      precioFormateado: `$${s.precio}`,
      duracionFormateada: `${s.duracionMinutos} min`,
    }));
  },

  getByPrestador: async (usuarioId: number): Promise<Service[]> => {
    const response = await api.get(`/servicios/prestador/${usuarioId}`);
    const services = response.data.data || response.data;
    return services.map((s: any) => ({
      ...s,
      precioFormateado: `$${s.precio}`,
      duracionFormateada: `${s.duracionMinutos} min`,
    }));
  },

  buscarAvanzado: async (filtros: ServiceFilters): Promise<Service[]> => {
    const response = await api.get('/servicios/buscar', { params: filtros });
    const services = response.data.data || response.data;
    return services.map((s: any) => ({
      ...s,
      precioFormateado: `$${s.precio}`,
      duracionFormateada: `${s.duracionMinutos} min`,
    }));
  },

  create: async (data: ServiceCreate): Promise<Service> => {
    const response = await api.post('/servicios', data);
    const service = response.data.data || response.data;
    return {
      ...service,
      precioFormateado: `$${service.precio}`,
      duracionFormateada: `${service.duracionMinutos} min`,
    };
  },

  update: async (id: number, data: Partial<ServiceCreate> & { estado: boolean }): Promise<void> => {
    await api.put(`/servicios/${id}`, { ...data, id });
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/servicios/${id}`);
  },

  toggleStatus: async (id: number, estado: boolean): Promise<void> => {
    await api.patch(`/servicios/${id}/status?estado=${estado}`);
  },
};

// También exportar como default por si acaso
export default servicesApi;