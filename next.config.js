const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const withSass = require("@zeit/next-sass");
const webpack = require("webpack");
const path = require("path");
const withCSS = require('@zeit/next-css')


//for analyze modules size.run this command for start analiz =>yarn run analyze
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'

});
module.exports = withBundleAnalyzer({});
module.exports = withCSS()
module.exports = withPlugins([[withSass], [withImages]], {
  webpack(config, options) {
    config.resolve.modules.push(path.resolve("./"));
    return config;
  }
});


