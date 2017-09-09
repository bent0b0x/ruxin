/* @flow */
import fs from "fs";
import { ASTTypes } from "constants/ApplicationConstants";
import { RequiredImports, RequiredExports } from "constants/StateConstants";
import addRequiredImports from "util/addRequiredImports";
import addRequiredExports from "util/addRequiredExports";
import createRecordSubclass from "util/createRecordSubclass";
import { createDirIfNeeded } from "util/dir";
import {
  findExportIndex,
  findDefaultExportIndex,
  findVariableDeclarationIndex
} from "util/program";
import toAST from "util/toAST";
import generate from "babel-generator";
import prettier from "prettier";
const babylon = require("babylon");

const parse = (input: string) =>
  babylon.parse(input, {
    sourceType: "module",
    plugins: ["flow"]
  });

import type {
  Project,
  StateProperties,
  ASTItem,
  Program,
  VariableDeclarator,
  VariableDeclaration,
  ExportNamedDeclaration,
  ClassDeclaration,
  ObjectProperty
} from "types";

const getCompleteStateDir = (config: Project): string =>
  `${config.baseDir}${config.stateDir}`;

const getStateFileName = (config: Project, state: string): string =>
  `${getCompleteStateDir(config)}/${state}.js`;

const getOrCreateStateFile = (state: string, config: Project): Program => {
  const completeStateDir: string = getCompleteStateDir(config);
  createDirIfNeeded(completeStateDir);

  const stateFileName = getStateFileName(config, state);

  if (!fs.existsSync(stateFileName)) {
    fs.writeFileSync(stateFileName, "");
  }

  const fileContents: string = fs.readFileSync(stateFileName, {
    encoding: "utf8"
  });

  const contents: Program = parse(fileContents).program;

  const newContents: Program = addRequiredImports(RequiredImports, contents);

  const newStateFile: string = prettier.format(generate(newContents).code);
  return parse(newStateFile).program;
};

const addState = (
  state: string,
  properties: StateProperties,
  stateFile: Program
): Program => {
  const newProgram: Program = Object.assign({}, stateFile);

  const stateIndex: number = findExportIndex(newProgram, "State");
  let subClassExists: boolean = false;

  if (stateIndex !== -1) {
    subClassExists = !!newProgram.body.find(
      (item: ASTItem) =>
        item.type === ASTTypes.ClassDeclaration &&
        ((item: any): ClassDeclaration).id.name === state
    );
    if (!subClassExists) {
      const stateClass: ClassDeclaration = createRecordSubclass(
        state,
        properties
      );

      newProgram.body = [
        ...newProgram.body.slice(0, stateIndex),
        stateClass,
        ...newProgram.body.slice(stateIndex)
      ];
    }
  }

  const mainStateExport: ExportNamedDeclaration = ((newProgram.body[
    stateIndex + (subClassExists ? 0 : 1)
  ]: any): ExportNamedDeclaration);

  const existingStateExport: ?VariableDeclarator = (mainStateExport: any).declaration.declarations[0].init.properties.find(
    (item: ObjectProperty) => {
      return item.key.name === state;
    }
  );

  if (!existingStateExport) {
    (mainStateExport: any).declaration.declarations[0].init.properties.unshift({
      type: ASTTypes.ObjectProperty,
      key: {
        type: ASTTypes.Identifier,
        name: state
      },
      value: {
        type: ASTTypes.Identifier,
        name: state
      },
      kind: "init",
      shorthand: true
    });
  }

  return newProgram;
};

const addReducerAndExport = (
  stateFile: Program,
  parentState: string
): Program => {
  const newStateFile: Program = Object.assign({}, stateFile);

  if (findVariableDeclarationIndex(stateFile, "reducer") === -1) {
    const reducer: VariableDeclaration = toAST(`const reducer = {}`, true);
    newStateFile.body.push(reducer);
  }

  if (findDefaultExportIndex(stateFile) === -1) {
    const defaultExport: ExportNamedDeclaration = toAST(
      `export default handleActions(reducers, new ${parentState}());`,
      true
    );
    newStateFile.body.push(defaultExport);
  }

  return newStateFile;
};

export default (
  state: string,
  properties: StateProperties,
  config: Project,
  parentState?: string
): void => {
  const baseState: string = parentState || state;
  let stateFile: Program = getOrCreateStateFile(baseState, config);

  stateFile = addRequiredExports(RequiredExports, state, stateFile);

  stateFile = addState(state, properties, stateFile);

  stateFile = addReducerAndExport(stateFile, baseState);

  const newStateString: string = prettier.format(generate(stateFile).code);

  fs.writeFileSync(getStateFileName(config, baseState), newStateString);
};
