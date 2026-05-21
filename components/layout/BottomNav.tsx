'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Home, Search, Grid, User, Calendar, Briefcase } from 'lucide-react';

export default function BottomNav() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Servicios', href: '/services', icon: Search },
    { name: 'Categorías', href: '/categories', icon: Grid },
    { name: user ? 'Perfil' : 'Cuenta', href: user ? '/perfil' : '/login', icon: User },
  ];

  // Si es profesional, agregar dashboard
  if (user?.rol === 'Prestador') {
    navItems.splice(2, 0, { name: 'Dashboard', href: '/dashboard/profesional', icon: Briefcase });
  }

  // Si es cliente, agregar reservas
  if (user?.rol === 'Cliente') {
    navItems.splice(2, 0, { name: 'Mis Reservas', href: '/mis-reservas', icon: Calendar });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-md border-t border-slate-700 py-2 px-4 md:hidden z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name}</span>
              {isActive && (
                <div className="absolute -top-1 w-8 h-0.5 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}