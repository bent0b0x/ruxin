#!/usr/bin/env node --harmony
var api = require("../../build/bundle");
var program = require("commander");
var findRootRuxin = require("./util/findRootRuxin");

program
  .version("0.0.0")
  .arguments("<component> [state]")
  .option("-s --state", "detect state")
  .action(function(name, state = "", options) {
    var baseDir = findRootRuxin(process.cwd());

    state = state ? state : options.state ? name : "";

    console.log("state: ", state);

    var firstDelimeterIndex = state.indexOf(".");
    var stateToUse =
      firstDelimeterIndex === -1 ? state : state.slice(firstDelimeterIndex + 1);

    api.component.create(
      name,
      stateToUse,
      firstDelimeterIndex === -1 ? "" : state.slice(0, firstDelimeterIndex),
      {
        baseDir
      }
    );
  });

program.parse(process.argv);
