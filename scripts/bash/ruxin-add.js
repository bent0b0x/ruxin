#!/usr/bin/env node --harmony
var api = require("../../build/bundle");
var program = require("commander");
var findRootRuxin = require("./util/findRootRuxin");
var createComponent = require("./util/createComponent");
var createContainer = require("./util/createContainer");
var getProps = require("./util/getProps");

const getStateName = state => {
  const firstDelimiterIndex = state.indexOf(".");
  if (firstDelimiterIndex === -1) {
    return state;
  } else {
    const subState = state.slice(firstDelimiterIndex + 1);
    return subState;
  }
};

const commitState = (state, props, dir, options) => {
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
  if (options.component) {
    createComponent(getStateName(state), state, {});
  }
  if (options.container) {
    createContainer(getStateName(state), state, {});
  }
};

program
  .version("0.0.0")
  .arguments("<state> [action]")
  .option("-p, --props", "initial state properties")
  .option("-c --component", "create a component")
  .option("-t --container", "create a container")
  .action(function(state, action, options) {
    var dir = findRootRuxin(process.cwd());
    if (action) {
      api.action.add(state, action, {
        baseDir: dir
      });
    } else {
      if (options.props) {
        getProps(state, {}, dir, commitState, options);
      } else {
        commitState(state, {}, dir, options);
      }
    }
  });

program.parse(process.argv);
