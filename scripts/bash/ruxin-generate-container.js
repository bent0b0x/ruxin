#!/usr/bin/env node --harmony
var program = require("commander");
var createContainer = require("./util/createContainer");

program
  .version("0.0.0")
  .arguments("<container> [state]")
  .option("-s --state", "detect state")
  .action(createContainer);

program.parse(process.argv);
