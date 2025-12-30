import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better PWA support
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  webpack: (config) => {
    return config;
  },
};

const withPWA = require('next-pwa')({
  dest: 'public', // Service Worker 的輸出目錄
  disable: process.env.NODE_ENV === 'development', // 開發模式下禁用 PWA
  register: true, // 自動註冊 Service Worker
  skipWaiting: true, // 跳過等待，立即啟用新的 Service Worker
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 天
        },
      },
    },
  ],
});

export default withPWA(nextConfig);
