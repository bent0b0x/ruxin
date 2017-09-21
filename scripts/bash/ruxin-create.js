#!/usr/bin/env node --harmony
var api = require("../../build/bundle");
var program = require("commander");

program.version("0.0.0").action(function(name) {
  api.init({
    baseDir: process.cwd() + "/" + name
  });
});

program.parse(process.argv);
