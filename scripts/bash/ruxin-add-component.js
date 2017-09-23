#!/usr/bin/env node --harmony
var program = require("commander");
var createComponent = require("./util/createComponent");

program
  .version("0.0.0")
  .arguments("<component> [state]")
  .option("-s --state", "detect state")
  .action(createComponent);

program.parse(process.argv);
