/* @flow */
import create from "./state/create";
import { addAction, addProperties } from "./state/add";
import { createComponent } from "./components/create";
import init from "./init";

export default {
  state: {
    create,
    addProperties
  },
  action: {
    add: addAction
  },
  component: {
    create: createComponent
  },
  init: init
};
