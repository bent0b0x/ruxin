/* @flow */
import create from "./state/create";
import { addAction } from "./state/add";
import init from "./init";

export default {
  state: {
    create
  },
  action: {
    add: addAction
  },
  init: init
};
