/* @flow */
import fs from "fs";
import {
  ASTTypes,
  RequiredImports,
  RequiredExports
} from "constants/ApplicationConstants";
import createExport from "util/createExport";
import addRequiredImports from "util/addRequiredImports";
import createRecordSubclass from "util/createRecordSubclass";
import { createDirIfNeeded } from "util/dir";
import { findExportIndex } from "util/program";
import generate from "babel-generator";
import prettier from "prettier";
import findLastIndex from "lodash.findlastindex";
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
  RequiredExport,
  VariableDeclarator,
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

const addRequiredExports = (state: string, stateFile: Program): Program => {
  const lastImportIndex: number = findLastIndex(
    stateFile.body,
    (item: ASTItem) => item.type === ASTTypes.ImportDeclaration
  );

  const newStateFile: Program = Object.assign({}, stateFile);

  let insertIndex: number = lastImportIndex === -1 ? 0 : lastImportIndex;

  RequiredExports.forEach((requiredExport: RequiredExport) => {
    const exportExists: boolean = !!newStateFile.body.find(
      (item: ASTItem) =>
        item.type === ASTTypes.ExportNamedDeclaration &&
        !!((item: any): ExportNamedDeclaration).declaration.declarations.find(
          (declaration: VariableDeclarator) =>
            declaration.id.name === requiredExport.name
        )
    );
    if (!exportExists) {
      newStateFile.body = [
        ...newStateFile.body.slice(0, insertIndex + 1),
        createExport(
          requiredExport.name,
          requiredExport.init,
          lastImportIndex === -1 ? 0 : stateFile.body[lastImportIndex].end + 1
        ),
        ...newStateFile.body.slice(insertIndex + 1)
      ];
      insertIndex += 1;
    }
  });

  return newStateFile;
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

export default (
  state: string,
  properties: StateProperties,
  config: Project,
  parentState?: string
): void => {
  const baseState: string = parentState || state;
  let stateFile: Program = getOrCreateStateFile(baseState, config);

  stateFile = addRequiredExports(state, stateFile);

  stateFile = addState(state, properties, stateFile);

  const newStateString: string = prettier.format(generate(stateFile).code);

  fs.writeFileSync(getStateFileName(config, baseState), newStateString);
};
