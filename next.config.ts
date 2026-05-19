/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5204',
        pathname: '/perfiles/**',
      },
    ],
  },
  // Permitir imágenes desde la carpeta public sin optimización
  images: {
    unoptimized: true,
  },
};

export default nextConfig;