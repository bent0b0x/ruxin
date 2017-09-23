/* @flow */
import create from "./state/create";
import { addAction, addProperties } from "./state/add";
import init from "./init";

export default {
  state: {
    create,
    addProperties
  },
  action: {
    add: addAction
  },
  init: init
};
