#!/usr/bin/env node --harmony
var program = require("commander");

program
  .version("0.0.0")
  .command("create <name>", "initialize project")
  .command("generate-state <state> [action]", "add to project")
  .command("add-props <state>", "add prop(s) to a state piece")
  .command("generate-component <component> [state]", "create a new component")
  .command("generate-container <container> [state]", "create a new container")
  .parse(process.argv);
