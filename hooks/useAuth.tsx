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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializar estado de forma síncrona
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          return JSON.parse(storedUser) as User;
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

        const userData: User = {
          id: usuarioId,
          nombre: nombre,
          email: userEmail,
          rol: rol,
          fotoUrl: fotoUrl || null,
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
        // La URL que viene de la API es algo como "/perfiles/archivo.jpg"
        // Pero Next.js necesita que esté en public o usar una URL completa
        const photoUrl = response.data;
        const updatedUser = { ...user, fotoUrl: photoUrl };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Foto actualizada");
        return response.data;
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
