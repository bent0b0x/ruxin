#!/usr/bin/env node --harmony
var program = require("commander");

program
  .version("0.0.0")
  .command("create <name>", "initialize project")
  .command("add <state> [action]", "add to project")
  .parse(process.argv);
