/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 1) Add 'img.shields.io' to the list of allowed domains
    domains: ['img.shields.io'],

    // 2) Explicitly allow SVG images
    dangerouslyAllowSVG: true,

    // 3) Optionally set a strict content security policy
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;


export default nextConfig;
