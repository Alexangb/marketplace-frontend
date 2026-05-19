'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { 
  User, Mail, Phone, MapPin, FileText, Camera, Save, Lock, 
  AlertCircle, CheckCircle, ArrowLeft
} from 'lucide-react';

export default function PerfilPage() {
  const { user, updateProfile, uploadPhoto, changePassword } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Formulario de perfil
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    biografia: '',
  });

  // Formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // URL completa para la foto
  const fotoUrl = user?.fotoUrl 
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${user.fotoUrl}`
    : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && mounted) {
      setFormData({
        nombre: user.nombre || '',
        apellido: (user as any).apellido || '',
        email: user.email || '',
        telefono: (user as any).telefono || '',
        direccion: (user as any).direccion || '',
        biografia: (user as any).biografia || '',
      });
    }
  }, [user, mounted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Filtrar campos vacíos y enviar solo los que tienen valor
      const dataToSend: any = {};
      
      if (formData.nombre && formData.nombre.trim() !== '') {
        dataToSend.nombre = formData.nombre.trim();
      }
      if (formData.apellido && formData.apellido.trim() !== '') {
        dataToSend.apellido = formData.apellido.trim();
      }
      if (formData.email && formData.email.trim() !== '') {
        dataToSend.email = formData.email.trim();
      }
      if (formData.telefono && formData.telefono.trim() !== '') {
        dataToSend.telefono = formData.telefono.trim();
      } else {
        dataToSend.telefono = null; // Enviar null si está vacío
      }
      if (formData.direccion && formData.direccion.trim() !== '') {
        dataToSend.direccion = formData.direccion.trim();
      } else {
        dataToSend.direccion = null;
      }
      if (formData.biografia && formData.biografia.trim() !== '') {
        dataToSend.biografia = formData.biografia.trim();
      } else {
        dataToSend.biografia = null;
      }
      
      await updateProfile(dataToSend);
      setSuccessMessage('Perfil actualizado exitosamente');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Recargar la página para mostrar los cambios
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato no permitido. Use JPG, PNG o GIF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    
    try {
      await uploadPhoto(file);
      setSuccessMessage('Foto de perfil actualizada');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Error al subir la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'La contraseña actual es requerida';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Debe tener mayúscula, minúscula y número';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      setSuccessMessage('Contraseña cambiada exitosamente');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso denegado</h2>
          <p className="text-slate-400">Debes iniciar sesión para ver tu perfil</p>
          <Link href="/login" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
          <p className="text-slate-400 mt-1">Gestiona tu información personal</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-500">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
              <div className="text-center">
                <div className="relative inline-block">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={user.nombre}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto border-4 border-blue-600">
                      <span className="text-4xl font-bold text-white">
                        {user.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {uploadingPhoto && (
                  <div className="mt-2 text-sm text-blue-500">Subiendo foto...</div>
                )}
                
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {user.nombre} {(user as any).apellido}
                </h2>
                <p className="text-slate-400 text-sm">{user.rol === 'Prestador' ? 'Profesional' : 'Cliente'}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Lock className="h-4 w-4" />
                  <span>Cambiar Contraseña</span>
                </button>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Información Personal
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    <Mail className="inline h-4 w-4 mr-1" /> Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    <Phone className="inline h-4 w-4 mr-1" /> Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+51 999 999 999"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" /> Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    placeholder="Tu dirección"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    <FileText className="inline h-4 w-4 mr-1" /> Biografía
                  </label>
                  <textarea
                    name="biografia"
                    rows={4}
                    value={formData.biografia}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos sobre ti..."
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Cambiar Contraseña</h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña actual *</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                {passwordErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.currentPassword}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nueva contraseña *</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar nueva contraseña *</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                {passwordErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Cambiar Contraseña'}
                </button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}