/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: {
      exclude: ["error"],
    },
  },
  experimental: {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  },
};

module.exports = nextConfig;
