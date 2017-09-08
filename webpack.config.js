var webpack = require("webpack");
var path = require("path");

var appDir = path.resolve(__dirname);
var scriptsDir = appDir + "/scripts";
var assetsDir = appDir + "/assets";
var stylesDir = appDir + "/styles";
var buildDir = path.resolve(__dirname, "build");
var testDir = path.resolve(__dirname, "test");

var prod = process.env.NODE_ENV === "production";

var config = {
  entry: scriptsDir + "/index.js",
  output: {
    path: buildDir,
    filename: "bundle.js"
  },
  target: "node",
  resolve: {
    alias: {
      scripts: scriptsDir,
      styles: stylesDir,
      assets: assetsDir,
      components: scriptsDir + "/components",
      constants: scriptsDir + "/constants",
      actions: scriptsDir + "/actions",
      states: scriptsDir + "/states",
      containers: scriptsDir + "/containers",
      selectors: scriptsDir + "/selectors",
      util: scriptsDir + "/util",
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
        test: /\.scss$/,
        include: stylesDir,
        exclude: /index.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              includPaths: stylesDir
            }
          }
        ]
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
  }
};

module.exports = config;
