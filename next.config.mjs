import "./env.mjs";


/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ]
  },
  reactStrictMode: true,
  images: {
    domains: [
      "plus.unsplash.com",
      "avatars.githubusercontent.com",
      "images.unsplash.com",
      "media.istockphoto.com",
      "pinetbox.com",
      "assets.coingecko.com",
      "cryptologos.cc",
      "assets.coingecko.com",
      "www.alchemy.com",
      "pump.fun",
      "encrypted-tbn0.gstatic.com"
    ],
  },
  experimental: {
    swcMinify: false,
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
}

export default nextConfig
