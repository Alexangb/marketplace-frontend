import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'ServiceHub - Marketplace de Servicios',
  description: 'Encuentra los mejores profesionales para tus necesidades',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-dark-bg antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
                borderRadius: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#F8FAFC',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#F8FAFC',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}