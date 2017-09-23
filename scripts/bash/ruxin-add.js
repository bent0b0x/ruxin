#!/usr/bin/env node --harmony
var api = require("../../build/bundle");
var program = require("commander");
var prompt = require("prompt");
var findRootRuxin = require("./util/findRootRuxin");

prompt.message = "";

const commitState = (state, props, dir) => {
  const config = {
    baseDir: dir
  };
  const firstDelimiterIndex = state.indexOf(".");
  if (firstDelimiterIndex === -1) {
    api.state.create(state, props, config);
  } else {
    const baseState = state.slice(0, firstDelimiterIndex);
    const subState = state.slice(firstDelimiterIndex + 1);
    api.state.create(subState, props, config, baseState);
  }
};

const getProps = (state, props = {}, dir) => {
  prompt.get(
    {
      name: "key",
      required: false,
      message: "key (leave blank to finish)"
    },
    function(err, { key }) {
      if (key) {
        prompt.get(
          {
            name: "type",
            required: true
          },
          function(err, { type }) {
            prompt.get(
              {
                name: "default",
                required: true
              },
              function(err, result) {
                props[key] = {
                  type: type,
                  default: result.default
                };
                getProps(state, props, dir);
              }
            );
          }
        );
      } else {
        commitState(state, props, dir);
      }
    }
  );
};

program
  .version("0.0.0")
  .arguments("<state> [action]")
  .option("-p, --props", "initial state properties")
  .action(function(state, action, options) {
    var dir = findRootRuxin(process.cwd());
    if (action) {
      api.action.add(state, action, {
        baseDir: dir
      });
    } else {
      if (options.props) {
        prompt.start();

        getProps(state, {}, dir);
      } else {
        commitState(state, {}, dir);
      }
    }
  });

program.parse(process.argv);
