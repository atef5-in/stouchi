/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PWA note: for the MVP we use a manual manifest + meta in layout.tsx.
  // Optional upgrade: add `next-pwa` for full offline service-worker caching.
};

export default nextConfig;
