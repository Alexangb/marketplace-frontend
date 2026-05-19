'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { servicesApi } from '@/lib/api/servicesApi';
import { bookingsApi } from '@/lib/api/bookingsApi';
import { Service } from '@/types/service';
import { Booking } from '@/types/booking';
import Link from 'next/link';
import { 
  Plus, Edit, Trash2, Calendar, DollarSign, Clock, Eye, EyeOff,
  Users, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

export default function ProfessionalDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'services' | 'bookings'>('services');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Formulario para crear/editar servicio
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracionMinutos: '',
    categoriaId: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && mounted && user.rol === 'Prestador') {
      loadServices();
      loadCategories();
    }
  }, [user, mounted]);

  useEffect(() => {
    if (services.length > 0 && mounted) {
      loadBookings();
    } else if (mounted && services.length === 0) {
      setLoading(false);
    }
  }, [services, mounted]);

  const loadServices = async () => {
    try {
      const data = await servicesApi.getByPrestador(user?.id || 0);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const allBookings: Booking[] = [];
      for (const service of services) {
        try {
          const serviceBookings = await bookingsApi.getByServicio(service.id);
          allBookings.push(...serviceBookings);
        } catch (e) {
          console.error(`Error loading bookings for service ${service.id}:`, e);
        }
      }
      setBookings(allBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5204/api';
      const response = await fetch(`${baseUrl}/categorias`);
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        precio: parseFloat(formData.precio),
        duracionMinutos: parseInt(formData.duracionMinutos),
        categoriaId: parseInt(formData.categoriaId),
        usuarioId: user?.id,
      };

      if (editingService) {
        await servicesApi.update(editingService.id, { ...data, estado: editingService.estado });
      } else {
        await servicesApi.create(data);
      }

      setShowCreateModal(false);
      setEditingService(null);
      setFormData({ nombre: '', descripcion: '', precio: '', duracionMinutos: '', categoriaId: '' });
      loadServices();
      alert(editingService ? 'Servicio actualizado' : 'Servicio creado');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error al guardar el servicio');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      try {
        await servicesApi.delete(id);
        loadServices();
        alert('Servicio eliminado');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error al eliminar el servicio');
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await servicesApi.toggleStatus(id, !currentStatus);
      loadServices();
      alert(`Servicio ${!currentStatus ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error al cambiar el estado');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    setUpdatingBookingId(bookingId);
    try {
      if (newStatus === 'Confirmada') {
        await bookingsApi.confirmar(bookingId);
      } else if (newStatus === 'Completada') {
        await bookingsApi.completar(bookingId);
      }
      await loadBookings();
      alert(`Reserva ${newStatus.toLowerCase()} exitosamente`);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error al actualizar el estado');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;

    setUpdatingBookingId(selectedBookingId);
    try {
      await bookingsApi.cancelar(selectedBookingId, cancelReason || undefined);
      await loadBookings();
      alert('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error al cancelar la reserva');
    } finally {
      setUpdatingBookingId(null);
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedBookingId(null);
    }
  };

  const getStatusBadge = (estado: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      'Pendiente': { color: 'bg-yellow-500/20 text-yellow-500', icon: AlertCircle },
      'Confirmada': { color: 'bg-blue-500/20 text-blue-500', icon: CheckCircle },
      'Cancelada': { color: 'bg-red-500/20 text-red-500', icon: XCircle },
      'Completada': { color: 'bg-green-500/20 text-green-500', icon: CheckCircle },
    };
    const config = statusConfig[estado] || statusConfig['Pendiente'];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span>{estado}</span>
      </span>
    );
  };

  const getStatusActions = (booking: Booking) => {
    if (booking.estado === 'Pendiente') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdateBookingStatus(booking.id, 'Confirmada')}
            disabled={updatingBookingId === booking.id}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            Confirmar
          </button>
          <button
            onClick={() => {
              setSelectedBookingId(booking.id);
              setShowCancelModal(true);
            }}
            disabled={updatingBookingId === booking.id}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      );
    }
    if (booking.estado === 'Confirmada') {
      return (
        <button
          onClick={() => handleUpdateBookingStatus(booking.id, 'Completada')}
          disabled={updatingBookingId === booking.id}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          Marcar como completada
        </button>
      );
    }
    return null;
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedStatus === 'todos') return true;
    return booking.estado === selectedStatus;
  });

  // Mostrar placeholder mientras se monta
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.rol !== 'Prestador') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso denegado</h2>
          <p className="text-slate-400">Esta página es solo para profesionales</p>
          <Link href="/" className="text-blue-500 hover:text-blue-400 mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard Profesional</h1>
            <p className="text-slate-400 mt-1">Gestiona tus servicios y reservas</p>
          </div>
          {activeTab === 'services' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Nuevo Servicio</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'services'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Mis Servicios</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Reservas Recibidas</span>
              {bookings.filter(b => b.estado === 'Pendiente').length > 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {bookings.filter(b => b.estado === 'Pendiente').length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Services Tab */}
        {activeTab === 'services' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Servicios</p>
                    <p className="text-3xl font-bold text-white">{services.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Servicios Activos</p>
                    <p className="text-3xl font-bold text-white">
                      {services.filter(s => s.estado).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Servicios Inactivos</p>
                    <p className="text-3xl font-bold text-white">
                      {services.filter(s => !s.estado).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                    <EyeOff className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Servicio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Duración</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Estado</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {services.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-slate-400">
                          No tienes servicios creados. ¡Crea tu primer servicio!
                        </td>
                      </tr>
                    ) : (
                      services.map((service) => (
                        <tr key={service.id} className="hover:bg-slate-700/50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white font-medium">{service.nombre}</p>
                              <p className="text-slate-400 text-sm line-clamp-1">{service.descripcion}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">${service.precio}</td>
                          <td className="px-6 py-4 text-slate-300">{service.duracionMinutos} min</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.estado ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'
                            }`}>
                              {service.estado ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleStatus(service.id, service.estado)}
                              className="p-1 text-slate-400 hover:text-white transition-colors"
                              title={service.estado ? 'Desactivar' : 'Activar'}
                            >
                              {service.estado ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingService(service);
                                setFormData({
                                  nombre: service.nombre,
                                  descripcion: service.descripcion || '',
                                  precio: service.precio.toString(),
                                  duracionMinutos: service.duracionMinutos.toString(),
                                  categoriaId: service.categoriaId.toString(),
                                });
                                setShowCreateModal(true);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-500"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="p-1 text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
                <p className="text-sm text-slate-400">Total Reservas</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <p className="text-2xl font-bold text-yellow-500">{bookings.filter(b => b.estado === 'Pendiente').length}</p>
                <p className="text-sm text-slate-400">Pendientes</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <p className="text-2xl font-bold text-blue-500">{bookings.filter(b => b.estado === 'Confirmada').length}</p>
                <p className="text-sm text-slate-400">Confirmadas</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <p className="text-2xl font-bold text-green-500">{bookings.filter(b => b.estado === 'Completada').length}</p>
                <p className="text-sm text-slate-400">Completadas</p>
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus('todos')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === 'todos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedStatus('Pendiente')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === 'Pendiente'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setSelectedStatus('Confirmada')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === 'Confirmada'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Confirmadas
              </button>
              <button
                onClick={() => setSelectedStatus('Completada')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === 'Completada'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Completadas
              </button>
              <button
                onClick={() => setSelectedStatus('Cancelada')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === 'Cancelada'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Canceladas
              </button>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-xl">
                <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No hay reservas</h3>
                <p className="text-slate-400">
                  {selectedStatus === 'todos' 
                    ? 'Aún no has recibido ninguna reserva' 
                    : `No hay reservas con estado "${selectedStatus}"`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {booking.servicioNombre || `Servicio #${booking.servicioId}`}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Cliente: {booking.usuarioNombre || `ID: ${booking.usuarioId}`}
                        </p>
                      </div>
                      {getStatusBadge(booking.estado)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-3 text-slate-400">
                        <Calendar className="h-5 w-5" />
                        <div>
                          <p className="text-xs">Fecha</p>
                          <p className="text-white">{new Date(booking.fechaReserva).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-400">
                        <Clock className="h-5 w-5" />
                        <div>
                          <p className="text-xs">Hora</p>
                          <p className="text-white">{booking.horaInicio.substring(0, 5)} - {booking.horaFin.substring(0, 5)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-400">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-xs">Precio</p>
                          <p className="text-white font-semibold">${booking.servicioPrecio || 0}</p>
                        </div>
                      </div>
                    </div>

                    {booking.notas && (
                      <div className="bg-slate-900 rounded-lg p-3 mb-4">
                        <p className="text-sm text-slate-400">
                          <span className="font-medium">Notas del cliente:</span> {booking.notas}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                      {getStatusActions(booking)}
                      <Link
                        href={`/services/${booking.servicioId}`}
                        className="text-blue-500 hover:text-blue-400 text-sm transition-colors"
                      >
                        Ver servicio
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para crear/editar servicio */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Precio *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Duración (min) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duracionMinutos}
                    onChange={(e) => setFormData({ ...formData, duracionMinutos: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Categoría *</label>
                <select
                  required
                  value={formData.categoriaId}
                  onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingService ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingService(null);
                    setFormData({ nombre: '', descripcion: '', precio: '', duracionMinutos: '', categoriaId: '' });
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de cancelación de reserva */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Cancelar reserva</h2>
            <p className="text-slate-400 mb-4">¿Estás seguro de que deseas cancelar esta reserva?</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Motivo (opcional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Cuéntanos por qué cancelas..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancelBooking}
                disabled={updatingBookingId !== null}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Sí, cancelar
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setSelectedBookingId(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
              >
                No, volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}