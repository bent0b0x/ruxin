#!/usr/bin/env node --harmony
var api = require("../../build/bundle");
var program = require("commander");
var findRootRuxin = require("./util/findRootRuxin");

program.version("0.0.0").action(function(name) {
  var baseDir = findRootRuxin(process.cwd());
  api.component.create(name, {
    baseDir
  });
});

program.parse(process.argv);
