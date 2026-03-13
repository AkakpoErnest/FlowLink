/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  experimental: {
    outputFileTracingRoot: undefined,
  },
=======
>>>>>>> fix-vercel-build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
<<<<<<< HEAD
    // Suppress MetaMask SDK react-native peer dep warning in browser build
=======
    // Stub out react-native peer dep from MetaMask SDK browser build
>>>>>>> fix-vercel-build
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    }
    return config
  },
}

module.exports = nextConfig

