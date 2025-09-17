/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@flowlink/shared'],
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

