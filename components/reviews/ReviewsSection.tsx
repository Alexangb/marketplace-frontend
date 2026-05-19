'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { resenasApi, Resena } from '@/lib/api/resenasApi';
import StarRating from '@/components/ui/StarRating';
import { Calendar, User, Star } from 'lucide-react';

interface ReviewsSectionProps {
  servicioId: number;
}

export default function ReviewsSection({ servicioId }: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Resena[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [distribution, setDistribution] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    calificacion: 5,
    comentario: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [servicioId]);

  const loadReviews = async () => {
    try {
      const [reviewsData, promedio, distribucionData] = await Promise.all([
        resenasApi.getByServicio(servicioId),
        resenasApi.getPromedio(servicioId),
        resenasApi.getDistribucion(servicioId),
      ]);
      setReviews(reviewsData);
      setAverageRating(promedio);
      setDistribution(distribucionData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      await resenasApi.create({
        usuarioId: user.id,
        servicioId,
        calificacion: formData.calificacion,
        comentario: formData.comentario,
      });
      setFormData({ calificacion: 5, comentario: '' });
      setShowForm(false);
      await loadReviews();
      alert('¡Reseña publicada exitosamente!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al publicar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4">Reseñas</h3>

      {/* Resumen de calificaciones */}
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(averageRating)} size={18} />
            <div className="text-sm text-slate-400 mt-1">{reviews.length} reseñas</div>
          </div>

          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 w-8">{star} ★</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-slate-400 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botón para escribir reseña */}
      {user && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Escribir una reseña
        </button>
      )}

      {/* Formulario de reseña */}
      {showForm && (
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">Tu calificación</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Calificación</label>
              <StarRating
                rating={formData.calificacion}
                size={28}
                interactive={true}
                onChange={(rating) => setFormData({ ...formData, calificacion: rating })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Comentario</label>
              <textarea
                rows={4}
                value={formData.comentario}
                onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                placeholder="Cuéntanos tu experiencia con este servicio..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Publicando...' : 'Publicar reseña'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de reseñas */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 bg-slate-800 rounded-xl">
          <p className="text-slate-400">No hay reseñas aún. ¡Sé el primero en calificar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {review.usuarioFoto ? (
                    <img src={review.usuarioFoto} alt={review.usuarioNombre} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{review.usuarioNombre}</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.calificacion} size={14} />
                      <span className="text-xs text-slate-500">{review.fechaFormateada}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-300 mt-2">{review.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}