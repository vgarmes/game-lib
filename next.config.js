// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from "./env.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL("https://res.cloudinary.com")],
    unoptimized: true,
  },
};

export default nextConfig;
