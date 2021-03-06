/* @flow */
import fs from "fs";
import { ASTTypes } from "constants/ApplicationConstants";
import { RequiredIndexImports } from "constants/StateConstants";
import addRequiredImports from "util/addRequiredImports";
import createRecordSubclass from "util/createRecordSubclass";
import { addStateToRootType } from "types/add";
import write from "../write";
import {
  createDirIfNeeded,
  getCompleteStateDir,
  getStateFileName,
  getReducerFileName,
  createFileIfNeeded,
  readFileSync
} from "util/dir";
import {
  findExportIndex,
  findDefaultExportIndex,
  findVariableDeclarationIndex,
  addExpressionToProgram,
  addShorthandExport,
  addShorthandProperty,
  findImportIndex,
  findClassDeclarationIndex,
  addImmutableImport
} from "util/program";
import toAST from "util/toAST";
import parse from "../parser";
import forEach from "lodash.foreach";

import type {
  File,
  Project,
  StateProperties,
  StateProperty,
  ASTItem,
  Program,
  VariableDeclaration,
  ExportNamedDeclaration,
  ClassDeclaration,
  ClassProperty
} from "types";

const getOrCreateStateFile = (state: string, config: Project): File => {
  const completeStateDir: string = getCompleteStateDir(config);
  createDirIfNeeded(completeStateDir);

  const stateFileName = getStateFileName(config, state);

  createFileIfNeeded(
    stateFileName,
    write(
      parse(`
import { Record } from 'immutable';
import { handleActions } from 'redux-actions';

import type { Action } from 'scripts/types';

export const ActionConstants = {};

export const Actions = {};

export const State = {};

export const Selectors = {};
`)
    )
  );

  const fileContents: string = readFileSync(stateFileName);

  const contents: File = parse(fileContents);

  return contents;
};

const addState = (
  state: string,
  properties: StateProperties,
  stateFile: Program,
  config: Project,
  parentState?: string
): Program => {
  let newProgram: Program = Object.assign({}, stateFile);

  let stateIndex: number = findExportIndex(newProgram, "State");
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

      forEach(properties, (prop: StateProperty) => {
        addImmutableImport(newProgram, prop.type);
      });

      if (parentState) {
        const parentExportIndex: number = findClassDeclarationIndex(
          stateFile,
          parentState
        );
        stateIndex =
          parentExportIndex !== -1 ? parentExportIndex - 1 : stateIndex;
      }

      addExpressionToProgram(stateClass, newProgram, stateIndex);
    }
  }

  const newStateIndex: number = findExportIndex(newProgram, "State");

  if (newStateIndex !== -1) {
    const mainStateExport: ExportNamedDeclaration = ((newProgram.body[
      newStateIndex
    ]: any): ExportNamedDeclaration);

    addShorthandExport(mainStateExport, state);
  }

  if (!parentState) {
    addStateToRootType(state, properties, config);
  }

  return newProgram;
};

const addReducerAndExport = (
  stateFile: Program,
  parentState: string
): Program => {
  const newStateProgram: Program = Object.assign({}, stateFile);

  if (findVariableDeclarationIndex(stateFile, "reducer") === -1) {
    const reducer: VariableDeclaration = toAST(`const reducer = {}`, true);
    newStateProgram.body.push(reducer);
  }

  if (findDefaultExportIndex(stateFile) === -1) {
    const defaultExport: ExportNamedDeclaration = toAST(
      `\nexport default handleActions(reducer, new ${parentState}());`,
      true
    );
    newStateProgram.body.push(defaultExport);
  }

  return newStateProgram;
};

export const createSelectorsForState = (
  state: string,
  props: StateProperties,
  program: Program
): Program => {
  const newProgram: Program = Object.assign({}, program);
  const selectorsIndex: number = findExportIndex(newProgram, "Selectors");

  if (selectorsIndex === -1) {
    throw new Error("Selectors export is missing");
  }

  const selectorExport: ExportNamedDeclaration = ((program.body[
    selectorsIndex
  ]: any): ExportNamedDeclaration);

  forEach(props, (prop: ClassProperty, propName: string): void => {
    let selectorExportIndex: number = findVariableDeclarationIndex(
      program,
      propName
    );

    if (selectorExportIndex === -1) {
      addExpressionToProgram(
        `const ${propName}: (state: ${state}) => ${prop.type} = (state: ${state}): ${prop.type} => state.get("${propName}");`,
        newProgram,
        selectorsIndex
      );
      selectorExportIndex += 1;
    }

    addShorthandExport(selectorExport, propName);
  });

  return newProgram;
};

const getOrCreateReducerFile = (config: Project): Program => {
  const reducerDir: string = getCompleteStateDir(config);
  createDirIfNeeded(reducerDir);

  const reducerFileName = getReducerFileName(config);

  createFileIfNeeded(reducerFileName);

  let fileContents: string = readFileSync(reducerFileName);

  let contents: Program = parse(fileContents).program;

  contents = addRequiredImports(RequiredIndexImports, contents);

  if (findDefaultExportIndex(contents) === -1) {
    contents.body.push(toAST(`export default combineReducers({});`, true));
  }

  return contents;
};

const addStateImport = (state: string, program: Program): Program => {
  const importPath: string = `state/${state}`;
  const importIndex: number = findImportIndex(program, importPath);
  if (importIndex === -1) {
    program = addRequiredImports(
      [
        {
          module: importPath,
          imports: [state],
          default: true
        }
      ],
      program
    );
  }

  return program;
};

const addStateToReducer = (
  state: string,
  program: Program,
  parentState?: string
): Program => {
  let newProgram: Program = Object.assign({}, program);

  if (!parentState) {
    newProgram = addStateImport(state, program);
  }

  const defaultExportIndex: number = findDefaultExportIndex(newProgram);

  if (defaultExportIndex === -1) {
    throw new Error("Default reducer export is missing");
  }

  addShorthandProperty(
    (newProgram.body[defaultExportIndex]: any).declaration.arguments[0],
    state
  );

  return newProgram;
};

export default (
  state: string,
  properties: StateProperties,
  config: Project,
  parentState?: string
): void => {
  const baseState: string = parentState || state;
  const stateFile: File = getOrCreateStateFile(baseState, config);
  let stateProgram: Program = stateFile.program;

  stateProgram = addState(state, properties, stateProgram, config, parentState);

  stateProgram = addReducerAndExport(stateProgram, baseState);

  if (state === baseState) {
    stateProgram = createSelectorsForState(state, properties, stateProgram);
    let reducer: Program = getOrCreateReducerFile(config);

    reducer = addStateToReducer(state, reducer, parentState);

    const newReducerFile: string = write(reducer);

    fs.writeFileSync(getReducerFileName(config), newReducerFile);
  }

  stateFile.program = stateProgram;

  const newStateString: string = write(stateFile);

  fs.writeFileSync(getStateFileName(config, baseState), newStateString);
};
