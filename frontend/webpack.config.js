"use strict";

module.exports = {
  mode: "production", // production | development
  entry: "./js/script.js",
  output: {
    filename: "bundle.js",
    path: __dirname + "/js"
  },
  watch: true,
  devtool: "source-map"
}