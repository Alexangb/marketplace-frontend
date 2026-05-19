"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { servicesApi } from "@/lib/api/servicesApi";
import { Service } from "@/types/service";
import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, User, AlertCircle } from "lucide-react";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const servicioId = id ? Number(id) : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (servicioId && servicioId > 0 && mounted) {
      loadService();
    }
  }, [servicioId, mounted]);

  const loadService = async () => {
    try {
      const data = await servicesApi.getById(servicioId);
      setService(data);
    } catch (error) {
      console.error("Error loading service:", error);
      setError("Error al cargar el servicio");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }

    if (!bookingDate) {
      setError("Por favor selecciona una fecha");
      return;
    }

    if (!bookingTime) {
      setError("Por favor selecciona una hora");
      return;
    }

    if (!servicioId || servicioId === 0) {
      setError("Error: ID de servicio inválido");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (bookingDate < today) {
      setError("No se pueden hacer reservas en fechas pasadas");
      return;
    }

    setBookingLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5204/api";
      const token = localStorage.getItem("token");

      // Formatear hora a HH:mm:ss
      let formattedTime = bookingTime;
      if (bookingTime.length === 5) {
        formattedTime = `${bookingTime}:00`;
      } else if (bookingTime.length === 4) {
        formattedTime = `0${bookingTime}:00`;
      } else if (!bookingTime.includes(":")) {
        formattedTime = `${bookingTime}:00:00`;
      }

      // ✅ OPCIÓN 3 (la que funciona): Sin dto, nombres en minúscula
      const requestBody = {
        usuarioId: user.id,
        servicioId: servicioId,
        fechaReserva: bookingDate,
        horaInicio: formattedTime,
      };

      console.log("Enviando reserva:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${baseUrl}/Reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log("Respuesta:", responseText);

      let result = null;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        throw new Error("Respuesta inválida del servidor");
      }

      if (response.ok && result.success) {
        alert("¡Reserva creada exitosamente!");
        router.push("/mis-reservas");
      } else {
        const errorMessage =
          result?.message || result?.title || "Error al crear la reserva";
        setError(errorMessage);
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.message || "Error al conectar con el servidor";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Servicio no encontrado
          </h2>
          <Link href="/" className="text-blue-500 hover:text-blue-400">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h1 className="text-3xl font-bold text-white mb-4">
                {service.nombre}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 text-slate-400">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-white">
                    ${service.precio}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Clock className="h-5 w-5" />
                  <span>{service.duracionMinutos} minutos</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Descripción
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.descripcion || "Sin descripción disponible"}
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-2 text-slate-400">
                  <User className="h-5 w-5" />
                  <span>
                    Prestador: {service.usuarioNombre || "No especificado"}
                  </span>
                </div>
                {service.categoriaNombre && (
                  <div className="px-3 py-1 bg-slate-700 rounded-lg text-sm text-slate-300">
                    {service.categoriaNombre}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">
                Reservar servicio
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-4">
                  <div className="bg-slate-900 rounded-lg p-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">
                        Precio del servicio:
                      </span>
                      <span className="text-white font-semibold">
                        ${service.precio}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Duración:</span>
                      <span className="text-white">
                        {service.duracionMinutos} minutos
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      "Reservar ahora"
                    )}
                  </button>

                  {!user && (
                    <p className="text-sm text-slate-400 text-center mt-3">
                      <Link
                        href="/login"
                        className="text-blue-500 hover:text-blue-400"
                      >
                        Inicia sesión
                      </Link>{" "}
                      para reservar este servicio
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}