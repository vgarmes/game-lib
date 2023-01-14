const { env } = require('./env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'media.steampowered.com'],
  },
};

module.exports = nextConfig;
