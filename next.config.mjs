/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  experimental: {
    appDir: true, // Habilita el App Router si no lo tienes habilitado ya
  },
  webpack: (config) => {
    // Configuración de alias
    config.resolve.alias["@"] = path.resolve(process.cwd(), "app"); // Apunta a la carpeta 'app'
    return config;
  },
};

export default nextConfig;
