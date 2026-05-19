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
  Sparkles,
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
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

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

  useEffect(() => {
    setImageError(false);
  }, [fotoUrl]);

  const handleNavigation = () => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 500);
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ServiceHub
              </span>
            </div>
            <div className="w-20 h-8 bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 z-50 animate-pulse" />
      )}

      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg"
            : "bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              onClick={handleNavigation}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ServiceHub
              </span>
            </Link>

            {/* Desktop Navigation - centrado */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-1 bg-slate-800/50 rounded-full p-1 backdrop-blur-sm">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleNavigation}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Button - solo icono en móvil */}
              <button className="hidden md:flex items-center bg-slate-800 rounded-full border border-slate-700 px-4 py-2 space-x-2 hover:border-blue-500 transition-colors">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Buscar...</span>
              </button>
              <button className="md:hidden p-2 rounded-full hover:bg-slate-800 transition-colors">
                <Search className="w-5 h-5 text-slate-400" />
              </button>

              {user ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  </button>

                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-800 transition-colors">
                      {fotoUrl && !imageError ? (
                        <img
                          src={fotoUrl}
                          alt={user.nombre}
                          className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                          loading="lazy"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.nombre?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="hidden lg:block text-sm font-medium text-slate-200">
                        {user.nombre?.split(' ')[0]}
                      </span>
                    </button>

                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-1">
                        <div className="px-3 py-2 border-b border-slate-700">
                          <p className="text-sm font-medium text-white">{user.nombre}</p>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/perfil"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                            onClick={handleNavigation}
                          >
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">Mi Perfil</span>
                          </Link>
                          <Link
                            href="/mis-reservas"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                            onClick={handleNavigation}
                          >
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">Mis Reservas</span>
                          </Link>
                          {user.rol === 'Prestador' && (
                            <Link
                              href="/professional/dashboard"
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                              onClick={handleNavigation}
                            >
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">Dashboard</span>
                            </Link>
                          )}
                          <hr className="my-1 border-slate-700" />
                          <Link
                            href="/settings"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                            onClick={handleNavigation}
                          >
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span className="text-sm">Configuración</span>
                          </Link>
                          <button
                            onClick={() => {
                              handleNavigation();
                              logout();
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-600/10 transition-colors text-red-500"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Cerrar Sesión</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    href="/login" 
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    onClick={handleNavigation}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all"
                    onClick={handleNavigation}
                  >
                    Registrarse
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-400" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Mejorado */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900 pt-16 px-4 md:hidden">
          <div className="flex flex-col space-y-2 mt-4">
            {/* Mobile Search */}
            <div className="flex items-center bg-slate-800 rounded-xl px-4 py-3 mb-4">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                className="ml-3 bg-transparent outline-none text-sm w-full text-slate-200 placeholder:text-slate-500"
              />
            </div>

            {/* Mobile Navigation */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavigation();
                }}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <item.icon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-200">{item.name}</span>
              </Link>
            ))}

            {/* Mobile Divider */}
            <div className="h-px bg-slate-800 my-2" />

            {/* Mobile Auth Links */}
            {!user ? (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation();
                  }}
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation();
                  }}
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all"
                >
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/perfil"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation();
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-200">Mi Perfil</span>
                </Link>
                <Link
                  href="/mis-reservas"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation();
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-200">Mis Reservas</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation();
                    logout();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-600/10 transition-colors text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}