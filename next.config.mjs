const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "media.graphassets.com" },
      { protocol: "https", hostname: "**.graphassets.com" },
    ],
  },
}

export default nextConfig
