/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    domains: [],
  },
  // Allow all localhost.run and locala.lt subdomains 
  allowedDevOrigins: ['127.0.0.1', 'localhost', 'cucin-84-54-73-233.a.free.pinggy.link', 'f88811f1b29330.lhr.life', '1d52fcb89eafc9.lhr.life', '322b83fd4492e2.lhr.life', 'verba.vercel.app']
};
module.exports = nextConfig;
