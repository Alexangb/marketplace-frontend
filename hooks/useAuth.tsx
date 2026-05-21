"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { authApi } from "@/lib/api/authApi";
import toast from "react-hot-toast";

// Definir la interfaz User
interface User {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  rol: string;
  fotoUrl?: string | null;
  estado?: boolean;
  fechaRegistro?: string;
}

// Definir tipos específicos
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

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  uploadPhoto: (file: File) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper para obtener URL completa de la foto
const getFullPhotoUrl = (fotoUrl: string | null | undefined): string | null => {
  if (!fotoUrl) return null;
  
  // Si ya es una URL completa (http o https), devolverla
  if (fotoUrl.startsWith("http")) {
    return fotoUrl;
  }
  
  // Si es una ruta relativa, construir la URL completa con la API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "https://marketplace-api-7hhq.onrender.com/api";
  return `${baseUrl}${fotoUrl}`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializar estado de forma síncrona
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          // Asegurar que la foto tenga URL completa
          if (parsedUser.fotoUrl) {
            parsedUser.fotoUrl = getFullPhotoUrl(parsedUser.fotoUrl);
          }
          return parsedUser;
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });

  // loading empieza en false porque ya tenemos los datos iniciales
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.success) {
        const {
          token,
          usuarioId,
          nombre,
          email: userEmail,
          rol,
          fotoUrl,
        } = response.data;

        // Convertir la URL de la foto a URL completa
        const fullFotoUrl = getFullPhotoUrl(fotoUrl);

        const userData: User = {
          id: usuarioId,
          nombre: nombre,
          email: userEmail,
          rol: rol,
          fotoUrl: fullFotoUrl,
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        toast.success("Inicio de sesión exitoso");
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError.response?.data?.message || "Error al iniciar sesión";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      if (response.success) {
        toast.success("Registro exitoso");
        await login(userData.email, userData.password);
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError.response?.data?.message || "Error al registrarse";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setLoading(false);
      toast.success("Sesión cerrada");
      window.location.href = "/login";
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    try {
      const response = await authApi.updateProfile(data);
      if (response.success && user) {
        const updatedUser = { ...user, ...response.data } as User;
        // Asegurar URL completa de la foto
        if (updatedUser.fotoUrl) {
          updatedUser.fotoUrl = getFullPhotoUrl(updatedUser.fotoUrl);
        }
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Perfil actualizado");
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError.response?.data?.message || "Error al actualizar perfil";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    setLoading(true);
    try {
      const response = await authApi.uploadPhoto(file);
      if (response.success && user) {
        // Obtener la URL relativa de la foto
        const relativeUrl = response.data;
        // Convertir a URL completa
        const fullPhotoUrl = getFullPhotoUrl(relativeUrl);
        const updatedUser = { ...user, fotoUrl: fullPhotoUrl };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Foto actualizada");
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError.response?.data?.message || "Error al subir foto";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    setLoading(true);
    try {
      const response = await authApi.changePassword(data);
      if (response.success) {
        toast.success("Contraseña cambiada exitosamente");
      }
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError.response?.data?.message || "Error al cambiar contraseña";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        uploadPhoto,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};