/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
       {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5204",
        pathname: "/perfiles/**",
      },
    ],
    unoptimized: true, // Permitir imágenes desde la carpeta public sin optimización
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
