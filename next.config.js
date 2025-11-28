// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from "./env.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "media.steampowered.com"],
    unoptimized: true,
  },
};

export default nextConfig;
