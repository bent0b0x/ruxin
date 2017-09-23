#!/usr/bin/env node --harmony
var program = require("commander");

program
  .version("0.0.0")
  .command("create <name>", "initialize project")
  .command("add <state> [action]", "add to project")
  .command("add-props <state>", "add prop(s) to a state piece")
  .command("add-component <component> [state]", "create a new component")
  .parse(process.argv);
