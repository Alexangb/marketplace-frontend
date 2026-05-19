/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5204",
        pathname: "/perfiles/**",
      },
    ],
    unoptimized: true, // Permitir imágenes desde la carpeta public sin optimización
  },
};

export default nextConfig;
