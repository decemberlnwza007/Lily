/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
    serverActions:{
      bodySizeLimit:'5mb'
    }
  },
  images: {
    remotePatterns:[
      {
        protocol:'https',
        hostname:'lh3.googleusercontent.com',
      }
    ]
  },
};

export default nextConfig
