/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ]
  },
  webpack: (config, { webpack, isServer, nextRuntime }) => {
    if (isServer && nextRuntime === "edge") {
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.versions": JSON.stringify({}),
        })
      );
    }
    return config;
  },
};

export default nextConfig
