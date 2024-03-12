/** @type {import('next').NextConfig} */

const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins = [
      ...config.plugins,

      new Dotenv({
        path: path.join(__dirname, ".env"),
        systemvars: true,
      }),
    ];
    return config;
  },
};

module.exports = nextConfig;
