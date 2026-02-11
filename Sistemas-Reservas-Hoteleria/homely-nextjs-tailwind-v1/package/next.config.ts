import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Esto ignora los errores de ESLint (como los 'any') durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Esto ignora los errores de validación de tipos durante el build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;