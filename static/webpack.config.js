var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var appDir = path.resolve(__dirname, "app");
var scriptsDir = appDir + "/scripts";
var assetsDir = appDir + "/assets";
var buildDir = path.resolve(__dirname, "build");
var testDir = path.resolve(__dirname, "test");

var prod = process.env.NODE_ENV === "production";

var config = {
  entry: scriptsDir + "/index.js",
  output: {
    path: buildDir,
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      scripts: scriptsDir,
      assets: assetsDir,
      components: scriptsDir + "/components",
      constants: scriptsDir + "/constants",
      actions: scriptsDir + "/actions",
      state: scriptsDir + "/state",
      containers: scriptsDir + "/containers",
      selectors: scriptsDir + "/selectors",
      apis: scriptsDir + "/apis",
      adapters: scriptsDir + "/adapters"
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: [appDir, testDir],
        loader: "babel-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        include: assetsDir,
        use: [
          {
            loader: "url-loader"
          }
        ]
      }
    ]
  },
  plugins: [new ExtractTextPlugin((!prod ? buildDir : ".") + "/styles.css")]
};

module.exports = config;
