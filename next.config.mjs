/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Page extensions are kept default; MDX is rendered through next-mdx-remote in route handlers,
  // which gives us full control over compilation and avoids the @next/mdx plugin overhead.
  pageExtensions: ['ts', 'tsx'],
  images: {
    // Allow remote Minecraft asset hosts; tweak as needed for production.
    remotePatterns: [
      { protocol: 'https', hostname: 'minecraft.wiki' },
      { protocol: 'https', hostname: 'launchercontent.mojang.com' },
      { protocol: 'https', hostname: 'www.minecraft.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    // Smaller server bundles → faster cold starts on Vercel.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
