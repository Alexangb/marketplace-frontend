'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { bookingsApi } from '@/lib/api/bookingsApi';
import { Booking } from '@/types/booking';
import Link from 'next/link';
import { Calendar, Clock, DollarSign, MapPin, XCircle, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function MisReservasPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (user) {
      loadReservas();
    }
  }, [user]);

  useEffect(() => {
    filterBookings();
  }, [selectedStatus, bookings]);

  const loadReservas = async () => {
    try {
      const data = await bookingsApi.getByUsuario(user?.id || 0);
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('Error al cargar tus reservas');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (selectedStatus === 'todos') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.estado === selectedStatus));
    }
  };

  const handleCancelClick = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBookingId) return;

    setCancellingId(selectedBookingId);
    try {
      await bookingsApi.cancelar(selectedBookingId, cancelReason || undefined);
      await loadReservas();
      alert('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error al cancelar la reserva');
    } finally {
      setCancellingId(null);
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedBookingId(null);
    }
  };

  const getStatusBadge = (estado: string) => {
    const statusConfig = {
      'Pendiente': { color: 'bg-yellow-500/20 text-yellow-500', icon: AlertCircle },
      'Confirmada': { color: 'bg-blue-500/20 text-blue-500', icon: CheckCircle },
      'Cancelada': { color: 'bg-red-500/20 text-red-500', icon: XCircle },
      'Completada': { color: 'bg-green-500/20 text-green-500', icon: CheckCircle },
    };
    const config = statusConfig[estado as keyof typeof statusConfig] || statusConfig['Pendiente'];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span>{estado}</span>
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso denegado</h2>
          <p className="text-slate-400">Debes iniciar sesión para ver tus reservas</p>
          <Link href="/login" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Iniciar Sesión
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mis Reservas</h1>
          <p className="text-slate-400 mt-1">Gestiona tus citas y servicios contratados</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
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

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Bookings list */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-xl">
            <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No tienes reservas</h3>
            <p className="text-slate-400 mb-4">
              {selectedStatus === 'todos' 
                ? 'Aún no has realizado ninguna reserva' 
                : `No tienes reservas con estado "${selectedStatus}"`}
            </p>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Explorar Servicios
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all">
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {booking.servicioNombre || `Servicio #${booking.servicioId}`}
                      </h3>
                      <p className="text-slate-400 text-sm">Reserva #{booking.id}</p>
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
                        <span className="font-medium">Notas:</span> {booking.notas}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                    <Link
                      href={`/services/${booking.servicioId}`}
                      className="text-blue-500 hover:text-blue-400 text-sm transition-colors"
                    >
                      Ver servicio
                    </Link>
                    {(booking.estado === 'Pendiente' || booking.estado === 'Confirmada') && (
                      <button
                        onClick={() => handleCancelClick(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="text-red-500 hover:text-red-400 text-sm transition-colors disabled:opacity-50"
                      >
                        {cancellingId === booking.id ? 'Cancelando...' : 'Cancelar reserva'}
                      </button>
                    )}
                    {booking.estado === 'Completada' && (
                      <button
                        className="text-yellow-500 hover:text-yellow-400 text-sm transition-colors"
                      >
                                        Calificar servicio
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
        
                      {/* Modal de cancelación */}
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
                                onClick={handleCancelConfirm}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
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