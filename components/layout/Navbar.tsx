"use client";

import { useState, useEffect, useRef } from "react";
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
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // ✅ CORREGIDO: user.fotoUrl ya viene completa desde useAuth (Cloudinary URL)
  const fotoUrl = user?.fotoUrl;

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

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = () => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 z-50 w-full bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
              <span className="text-base font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ServiceHub
              </span>
            </div>
            <div className="w-20 h-7 bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 z-50" />
      )}

      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg"
            : "bg-slate-900 border-b border-slate-800/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-1.5 shrink-0"
              onClick={handleNavigation}
            >
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ServiceHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleNavigation}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center space-x-1.5">
                      <item.icon className="w-3.5 h-3.5" />
                      <span>{item.name}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search button */}
              <button className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                <Search className="w-4 h-4 text-slate-400" />
              </button>

              {user ? (
                <div className="flex items-center space-x-1">
                  <button className="relative p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </button>

                  {/* Menú de perfil - con clic */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={toggleProfileMenu}
                      className="flex items-center space-x-1.5 p-0.5 rounded-full hover:bg-slate-800 transition-colors"
                    >
                      {fotoUrl && !imageError ? (
                        <img
                          src={fotoUrl}
                          alt={user.nombre}
                          className="w-7 h-7 rounded-full object-cover border border-blue-500"
                          loading="lazy"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {user.nombre?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </button>

                    {/* Menú desplegable */}
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50">
                        <div className="p-1">
                          <div className="px-3 py-2 border-b border-slate-700">
                            <p className="text-sm font-medium text-white">
                              {user.nombre}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="py-1">
                            <Link
                              href="/perfil"
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                handleNavigation();
                              }}
                            >
                              <User className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">Mi Perfil</span>
                            </Link>
                            <Link
                              href="/mis-reservas"
                              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                handleNavigation();
                              }}
                            >
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">Mis Reservas</span>
                            </Link>
                            {user.rol === "Prestador" && (
                              <Link
                                href="dashboard/profesional"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                                onClick={() => {
                                  setIsProfileMenuOpen(false);
                                  handleNavigation();
                                }}
                              >
                                <Briefcase className="w-4 h-4 text-slate-400" />
                                <span className="text-sm">Dashboard</span>
                              </Link>
                            )}
                            <hr className="my-1 border-slate-700" />
                            <button
                              onClick={() => {
                                setIsProfileMenuOpen(false);
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
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Link
                    href="/login"
                    className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    onClick={handleNavigation}
                  >
                    Ingresar
                  </Link>
                  <Link
                    href="/register"
                    className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-md transition-all"
                    onClick={handleNavigation}
                  >
                    Unirse
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900 pt-14 px-4 md:hidden">
          <div className="flex flex-col space-y-1 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavigation();
                }}
                className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <item.icon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-200">{item.name}</span>
              </Link>
            ))}

            <div className="h-px bg-slate-800 my-2" />

            {!user ? (
              <div className="space-y-2 pt-2">
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
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                >
                  Registrarse
                </Link>
              </div>
            ) : (
              <div className="space-y-1 pt-2">
                <Link
                  href="/perfil"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation();
                  }}
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-colors"
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
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-slate-800 transition-colors"
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
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-red-600/10 transition-colors text-red-500"
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
