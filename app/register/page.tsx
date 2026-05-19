'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Briefcase,
  UserCheck,
  Sparkles,
  Shield
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'Cliente',
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (formData.apellido && formData.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al least 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'La contraseña debe tener mayúscula, minúscula y número';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const registerData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        rol: formData.rol,
      };
      await register(registerData);
      router.push('/');
    } catch (error) {
      console.error('Error en registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 shadow-premium">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Crear cuenta
            </h2>
            <p className="mt-2 text-dark-textSecondary">
              Únete a la revolución de servicios
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-dark-textSecondary">Seguro</p>
            </div>
            <div className="text-center">
              <UserCheck className="w-5 h-5 text-secondary mx-auto mb-2" />
              <p className="text-xs text-dark-textSecondary">Verificado</p>
            </div>
            <div className="text-center">
              <Briefcase className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="text-xs text-dark-textSecondary">Profesional</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="nombre"
                label="Nombre"
                placeholder="Juan"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
                icon={<User className="w-4 h-4" />}
              />
              <Input
                name="apellido"
                label="Apellido"
                placeholder="Perez"
                value={formData.apellido}
                onChange={handleChange}
                error={errors.apellido}
                icon={<User className="w-4 h-4" />}
              />
            </div>

            <Input
              name="email"
              type="email"
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock className="w-4 h-4" />}
            />

            <Input
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              label="Confirmar contraseña"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock className="w-4 h-4" />}
            />

            {/* Rol Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-textSecondary mb-2">
                Tipo de cuenta
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rol: 'Cliente' })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.rol === 'Cliente'
                      ? 'border-primary bg-primary/10'
                      : 'border-dark-border hover:border-primary/50'
                  }`}
                >
                  <UserCheck className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-medium">Cliente</p>
                  <p className="text-xs text-dark-textSecondary">Busco servicios</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rol: 'Prestador' })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.rol === 'Prestador'
                      ? 'border-secondary bg-secondary/10'
                      : 'border-dark-border hover:border-secondary/50'
                  }`}
                >
                  <Briefcase className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-medium">Prestador</p>
                  <p className="text-xs text-dark-textSecondary">Ofrezco servicios</p>
                </button>
              </div>
            </div>

            {/* Show Password */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 rounded border-dark-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-dark-textSecondary">Mostrar contraseña</span>
            </label>

            <Button type="submit" loading={loading} className="w-full">
              Crear cuenta
            </Button>

            <p className="text-center text-sm text-dark-textSecondary">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
                Inicia sesión
              </Link>
            </p>
          </form>

          {/* Password requirements */}
          <div className="mt-6 p-4 bg-dark-surface rounded-xl">
            <p className="text-xs font-medium text-dark-textSecondary mb-3">Requisitos de contraseña:</p>
            <div className="space-y-2 text-xs">
              {[
                { text: 'Mínimo 6 caracteres', check: formData.password.length >= 6 },
                { text: 'Al menos una mayúscula', check: /[A-Z]/.test(formData.password) },
                { text: 'Al menos una minúscula', check: /[a-z]/.test(formData.password) },
                { text: 'Al menos un número', check: /[0-9]/.test(formData.password) },
              ].map((req, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  {req.check ? (
                    <CheckCircle className="w-3 h-3 text-success" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-dark-textSecondary" />
                  )}
                  <span className={req.check ? 'text-dark-text' : 'text-dark-textSecondary'}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}