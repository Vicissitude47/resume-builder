/** @type {import('next').Config} */
const config = {
  // Enable Edge Runtime for Vercel edge functions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    turbo: {
      rules: {
        // Disable the default font loading rules
        '*.woff2': ['raw'],
      },
    },
  },
  // Output standalone build for better deployment performance
  output: 'standalone',
};

export default config;
