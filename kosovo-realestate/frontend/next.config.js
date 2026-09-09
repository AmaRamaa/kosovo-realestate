/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-leaflet's imperative Leaflet lifecycle doesn't survive React 18
  // Strict Mode's dev-only double-mount (throws "Map container is already
  // initialized"), so it's disabled — dev-only effect, no production impact.
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
};

module.exports = nextConfig;
