"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { servicesApi } from "@/lib/api/servicesApi";
import { Service } from "@/types/service";
import Link from "next/link";
import { Search, Clock, DollarSign, User } from "lucide-react";

import OptimizedImage from "@/components/ui/OptimizedImage";


export default function HomePage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAllActive();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Categorias`,
      );
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((s) => s.categoriaId === selectedCategory);
    }

    setFilteredServices(filtered);
  };

  

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, services]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-16 md:pb-0">
      {/* Pull-to-refresh indicator */}
     

      {/* Hero Section - Mejorada para móvil */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-2 sm:mb-3 md:mb-4">
            Encuentra el servicio que necesitas
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-center text-blue-100 mb-6 sm:mb-8">
            Conectamos profesionales calificados con clientes que buscan calidad
          </p>

          {/* Search Bar - Más grande en móvil */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Buscar servicios por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-12 pr-4 py-3 sm:py-4 bg-white rounded-lg sm:rounded-xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 space-y-6">
            <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                Categorías
              </h3>
              <div className="space-y-1 sm:space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    selectedCategory === null
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Todos los servicios
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm sm:text-base text-slate-400">
                {filteredServices.length}{" "}
                {filteredServices.length === 1
                  ? "servicio encontrado"
                  : "servicios encontrados"}
              </p>
            </div>

            {filteredServices.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 rounded-xl">
                <p className="text-slate-400">No se encontraron servicios</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredServices.map((service) => (
                  <Link key={service.id} href={`/services/${service.id}`}>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
                      <div className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-xl font-semibold text-white mb-2 line-clamp-1">
                          {service.nombre}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                          {service.descripcion || "Sin descripción"}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                            <span className="text-xl sm:text-2xl font-bold text-white">
                              {service.precioFormateado}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-400">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">
                              {service.duracionFormateada}
                            </span>
                          </div>
                        </div>
                        {service.categoriaNombre && (
                          <div className="inline-block px-2 py-1 bg-slate-700 rounded-lg text-xs text-slate-300">
                            {service.categoriaNombre}
                          </div>
                        )}
                        {service.usuarioNombre && (
                          <div className="flex items-center space-x-1 mt-3 text-xs text-slate-500">
                            <User className="h-3 w-3" />
                            <span className="truncate">{service.usuarioNombre}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}