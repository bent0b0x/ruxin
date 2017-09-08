/* @flow */
import fs from "fs";
import { ASTTypes } from "constants/ApplicationConstants";
import createImport from "util/createImport";
import addRequiredImports from "util/addRequiredImports";
import { generate } from "astring";
import prettier from "prettier";

const acorn = require("acorn");

import type {
  Project,
  StateProperties,
  ImportDeclaration,
  ASTItem,
  Program,
  RequiredImport
} from "types";

const requiredImports: Array<RequiredImport> = [
  {
    module: "immutable",
    imports: ["Record", "List"]
  },
  {
    module: "redux",
    imports: ["combineReducers"]
  }
];

const getOrCreateStateFile = (state: string, config: Project): Program => {
  const completeStateDir: string = `${config.baseDir}${config.stateDir}`;
  if (!fs.existsSync(completeStateDir)) {
    fs.mkdirSync(completeStateDir);
  }

  const stateFileName = `${completeStateDir}/${state}.js`;

  if (!fs.existsSync(stateFileName)) {
    fs.writeFileSync(stateFileName, "");
  }

  const fileContents: string = fs.readFileSync(stateFileName, {
    encoding: "utf8"
  });

  const contents: Program = acorn.parse(fileContents, {
    sourceType: "module"
  });

  const newContents: Program = addRequiredImports(requiredImports, contents);

  const newStateFile: string = prettier.format(generate(newContents));

  fs.writeFileSync(stateFileName, newStateFile);

  return acorn.parse(fileContents, {
    sourceType: "module"
  });
};

export default (
  state: string,
  properties: StateProperties,
  config: Project
): void => {
  const stateFile: Program = getOrCreateStateFile(state, config);

  console.log(JSON.stringify(stateFile));
};
