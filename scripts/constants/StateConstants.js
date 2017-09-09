/* @flow */
import type { RequiredImport, RequiredExport } from "types";

export const RequiredImports: Array<RequiredImport> = [
  {
    module: "immutable",
    imports: ["Record"]
  },
  {
    module: "redux-actions",
    imports: ["handleActions", "createAction"]
  }
];

export const RequiredExports: Array<RequiredExport> = [
  {
    name: "ActionConstants",
    init: {}
  },
  {
    name: "Actions",
    init: {}
  },
  {
    name: "State",
    init: {}
  },
  {
    name: "Selectors",
    init: {}
  }
];
