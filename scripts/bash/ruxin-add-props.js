#!/usr/bin/env node --harmony
var api = require("../../build/bundle");
var findRootRuxin = require("./util/findRootRuxin");
var getProps = require("./util/getProps");
var program = require("commander");

var commitProps = (state, props, dir) => {
  const config = {
    baseDir: dir
  };

  if (!Object.keys(props).length) {
    return;
  }

  const firstDelimiterIndex = state.indexOf(".");
  if (firstDelimiterIndex === -1) {
    api.state.addProperties(state, props, config);
  } else {
    const baseState = state.slice(0, firstDelimiterIndex);
    const subState = state.slice(firstDelimiterIndex + 1);
    api.state.addProperties(subState, props, config, baseState);
  }
};

program.version("0.0.0").action(function(state) {
  var dir = findRootRuxin(process.cwd());

  getProps(state, {}, dir, commitProps);
});

program.parse(process.argv);
