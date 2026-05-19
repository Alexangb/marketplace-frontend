import api from '../axios';

export const categoriesApi = {
  getAll: async () => {
    const response = await api.get('/categorias');
    return response.data.data || response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data.data || response.data;
  },

  getActive: async () => {
    const response = await api.get('/categorias/activas');
    return response.data.data || response.data;
  },

  create: async (data: { nombre: string; descripcion?: string }) => {
    const response = await api.post('/categorias', data);
    return response.data.data || response.data;
  },

  update: async (id: number, data: { nombre: string; descripcion?: string; estado: boolean }) => {
    const response = await api.put(`/categorias/${id}`, { ...data, id });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  },

  toggleStatus: async (id: number, estado: boolean) => {
    const response = await api.patch(`/categorias/${id}/status?estado=${estado}`);
    return response.data;
  },
};