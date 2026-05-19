'use client';

import { useEffect, useState } from 'react';
import { servicesApi } from '@/lib/api/servicesApi';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, Search } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAllActive();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Link href="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al inicio</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Todos los Servicios</h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-slate-400">
          {filteredServices.length} {filteredServices.length === 1 ? 'servicio encontrado' : 'servicios encontrados'}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer">
                <h3 className="text-xl font-semibold text-white mb-2">{service.nombre}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.descripcion || 'Sin descripción'}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-green-500">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">${service.precio}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{service.duracionMinutos} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No se encontraron servicios</p>
          </div>
        )}
      </div>
    </div>
  );
}