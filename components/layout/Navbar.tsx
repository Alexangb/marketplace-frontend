"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  Bell,
  User,
  Menu,
  X,
  Home,
  Briefcase,
  Grid,
  Compass,
  FileText,
  LogOut,
  Settings,
  Star,
  MessageCircle,
} from "lucide-react";

const navItems = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Servicios", href: "/services", icon: Briefcase },
  { name: "Categorías", href: "/categories", icon: Grid },
  { name: "Explorar", href: "/explore", icon: Compass },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // URL completa para la foto
  const fotoUrl = user?.fotoUrl 
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${user.fotoUrl}`
    : null;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resetear error de imagen cuando cambia la URL
  useEffect(() => {
    setImageError(false);
  }, [fotoUrl]);

  // Si no está montado, mostrar un placeholder para evitar hidratación
  if (!mounted) {
    return (
      <nav className="fixed top-0 z-50 w-full bg-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl" />
              <span className="text-xl font-bold">ServiceHub</span>
            </div>
            <div className="w-24 h-10 bg-slate-700 rounded-xl animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "glass shadow-premium"
            : "bg-slate-800/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ServiceHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-slate-900 rounded-xl border border-slate-700 px-4 py-2 w-80">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
              />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button className="relative p-2 rounded-xl hover:bg-slate-700 transition-colors">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                  </button>

                  <div className="relative group">
                    <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-700 transition-colors">
                      {/* Avatar con foto - usando img normal en lugar de Image */}
                      {fotoUrl && !imageError ? (
                        <img
                          src={fotoUrl}
                          alt={user.nombre}
                          className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.nombre?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="hidden lg:block text-sm font-medium">
                        {user.nombre}
                      </span>
                    </button>

                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-2">
                        <Link
                          href="/perfil"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">Mi Perfil</span>
                        </Link>

                        <Link
                          href="/mis-reservas"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">Mis Reservas</span>
                        </Link>
                        <Link
                          href="/favorites"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span className="text-sm">Favoritos</span>
                        </Link>
                        <Link
                          href="/messages"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Mensajes</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Configuración</span>
                        </Link>
                        <hr className="my-2 border-slate-700" />
                        <button
                          onClick={logout}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600/10 transition-colors text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="btn-secondary">
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-800 pt-20 px-4 md:hidden animate-slide-up">
          <div className="flex flex-col space-y-4">
            {/* Mobile Search */}
            <div className="flex items-center bg-slate-900 rounded-xl border border-slate-700 px-4 py-3">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                className="ml-2 bg-transparent outline-none text-sm w-full"
              />
            </div>

            {/* Mobile Navigation */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}