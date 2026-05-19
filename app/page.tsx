"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { servicesApi } from "@/lib/api/servicesApi";
import { Service } from "@/types/service";
import Link from "next/link";
import { Search, Clock, DollarSign, User } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, services]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Encuentra el servicio que necesitas
          </h1>
          <p className="text-xl text-center text-blue-100 mb-8">
            Conectamos profesionales calificados con clientes que buscan calidad
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar servicios por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Categorías
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
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
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
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
              <p className="text-slate-400">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <Link key={service.id} href={`/services/${service.id}`}>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                          {service.nombre}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                          {service.descripcion || "Sin descripción"}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <span className="text-2xl font-bold text-white">
                              {service.precioFormateado}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
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
                            <span>{service.usuarioNombre}</span>
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
