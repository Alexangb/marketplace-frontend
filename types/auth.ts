export interface User {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  rol: string;
  fotoUrl?: string | null;
  estado?: boolean;
  fechaRegistro?: string;
  telefono?: string;
  direccion?: string;
  biografia?: string;
}

export interface UpdateProfileData {
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  direccion?: string;
  biografia?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}