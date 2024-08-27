import "./env.mjs";


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "plus.unsplash.com",
      "avatars.githubusercontent.com",
      "images.unsplash.com",
      "media.istockphoto.com",
    ],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
}

export default nextConfig
