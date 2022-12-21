/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  swcMinify: true,
  async rewrites() {
    return [
      // Do not rewrite API routes
      {
        source: "/api/:any*",
        destination: "/api/:any*",
      },
      // Rewrite everything else to use `pages/index`
      {
        source: "/:any*",
        destination: "/",
      },
    ];
  },
};

module.exports = nextConfig;
