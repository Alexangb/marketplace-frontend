'use client';

import { useEffect, useState } from 'react';
import { categoriesApi } from '@/lib/api/categoriesApi';
import { servicesApi } from '@/lib/api/servicesApi';
import Link from 'next/link';
import { ArrowLeft, Tag, Package } from 'lucide-react';

interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

interface CategoryWithCount extends Category {
  serviciosCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoriesWithCount();
  }, []);

  const loadCategoriesWithCount = async () => {
    try {
      // Obtener todas las categorías
      const allCategories = await categoriesApi.getAll();
      
      // Obtener servicios para contar por categoría
      const services = await servicesApi.getAllActive();
      
      // Agregar conteo de servicios a cada categoría
      const categoriesWithCount = allCategories.map(cat => ({
        ...cat,
        serviciosCount: services.filter(s => s.categoriaId === cat.id).length
      }));
      
      // Ordenar por cantidad de servicios (descendente)
      categoriesWithCount.sort((a, b) => b.serviciosCount - a.serviciosCount);
      
      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <Link href="/" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Categorías</h1>
          <p className="text-slate-400 mt-1">Explora servicios por categoría</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/services?categoria=${category.id}`}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-600/20 rounded-xl group-hover:bg-blue-600/30 transition-colors">
                  <Tag className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex items-center space-x-1 text-slate-400">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">{category.serviciosCount} servicios</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {category.nombre}
              </h3>
              <p className="text-slate-400 text-sm line-clamp-2">
                {category.descripcion || 'Sin descripción'}
              </p>
              
              <div className="mt-4 text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Ver servicios →
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {categories.length === 0 && (
          <div className="text-center py-12 bg-slate-800 rounded-xl">
            <Tag className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay categorías</h3>
            <p className="text-slate-400">No se encontraron categorías disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}