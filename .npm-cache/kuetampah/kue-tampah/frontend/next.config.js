/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    dirs: ["app", "components", "context", "lib", "utils"],
  },
};

export default nextConfig;
