#!/usr/bin/env node --harmony
var api = require("../../build/bundle");
var program = require("commander");
var prompt = require("prompt");

prompt.message = "";

const commmitState = (state, props) => {
  const config = {
    baseDir: process.cwd()
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

const getProps = (state, props = {}) => {
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
                getProps(state, props);
              }
            );
          }
        );
      } else {
        commmitState(state, props);
      }
    }
  );
};

program
  .version("0.0.0")
  .arguments("<state> [action]")
  .option("-p, --props", "initial state properties")
  .action(function(state, action, options) {
    if (action) {
      api.action.add(state, action, {
        baseDir: process.cwd()
      });
    } else {
      if (options.props) {
        prompt.start();

        getProps(state);
      } else {
        commmitState(state, {});
      }
    }
  });

program.parse(process.argv);
