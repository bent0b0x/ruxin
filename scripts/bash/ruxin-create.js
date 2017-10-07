#!/usr/bin/env node --harmony
var api = require("../../build/bundle");
var program = require("commander");
var prompt = require("./util/prompt");

program.version("0.0.0").action(function(name) {
  prompt.get(
    {
      name: "projectName",
      required: false,
      message: `Project name (defaults to ${name})`
    },
    (err, { projectName }) => {
      prompt.get(
        {
          name: "description",
          required: false,
          message: `Project description (not required)`
        },
        (err, { description }) => {
          api.init({
            baseDir: process.cwd() + "/" + name,
            name: projectName || name,
            description
          });
        }
      );
    }
  );
});

program.parse(process.argv);
