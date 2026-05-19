import api from '../axios';

// Definir tipos
interface RegisterData {
  nombre: string;
  apellido?: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol?: string;
}

interface UpdateProfileData {
  nombre: string;
  apellido?: string;
  email: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    tokenExpiration: string;
    email: string;
    nombre: string;
    fotoUrl: string | null;
    rol: string;
    usuarioId: number;
  };
  errors: string | null;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/perfil');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/auth/perfil', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await api.post('/auth/perfil/cambiar-password', data);
    return response.data;
  },

  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('archivo', file);
    const response = await api.post('/auth/perfil/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};