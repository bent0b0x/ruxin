/* @flow */
import fs from "fs";
import { ASTTypes } from "constants/ApplicationConstants";
import {
  RequiredImports,
  RequiredExports,
  RequiredIndexImports
} from "constants/StateConstants";
import addRequiredImports from "util/addRequiredImports";
import addRequiredExports from "util/addRequiredExports";
import createRecordSubclass from "util/createRecordSubclass";
import { addType } from "types/add";
import write from "../write";
import {
  createDirIfNeeded,
  getCompleteStateDir,
  getStateFileName,
  getReducerFileName,
  createFileIfNeeded
} from "util/dir";
import {
  findExportIndex,
  findDefaultExportIndex,
  findVariableDeclarationIndex,
  addExpressionToProgram,
  addShorthandExport,
  addShorthandProperty,
  findImportIndex
} from "util/program";
import toAST from "util/toAST";
import parse from "../parser";
import forEach from "lodash.foreach";

import type {
  Project,
  StateProperties,
  ASTItem,
  Program,
  VariableDeclaration,
  ExportNamedDeclaration,
  ClassDeclaration,
  ClassProperty
} from "types";

const getOrCreateStateFile = (state: string, config: Project): Program => {
  const completeStateDir: string = getCompleteStateDir(config);
  createDirIfNeeded(completeStateDir);

  const stateFileName = getStateFileName(config, state);

  createFileIfNeeded(stateFileName);

  const fileContents: string = fs.readFileSync(stateFileName, {
    encoding: "utf8"
  });

  const contents: Program = parse(fileContents).program;

  const newContents: Program = addRequiredImports(RequiredImports, contents);

  const newStateFile: string = write(newContents);
  return parse(newStateFile).program;
};

const addState = (
  state: string,
  properties: StateProperties,
  stateFile: Program,
  config: Project,
  parentState?: string
): Program => {
  let newProgram: Program = Object.assign({}, stateFile);

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

      addExpressionToProgram(stateClass, newProgram, stateIndex);
    }
  }

  const mainStateExport: ExportNamedDeclaration = ((newProgram.body[
    stateIndex + (subClassExists ? 0 : 1)
  ]: any): ExportNamedDeclaration);

  addShorthandExport(mainStateExport, state);

  addType(state, properties, config, !parentState);

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
      `export default handleActions(reducer, new ${parentState}());`,
      true
    );
    newStateFile.body.push(defaultExport);
  }

  return newStateFile;
};

const createSelectorsForState = (
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

  let fileContents: string = fs.readFileSync(reducerFileName, {
    encoding: "utf8"
  });

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
  let stateFile: Program = getOrCreateStateFile(baseState, config);

  stateFile = addRequiredExports(RequiredExports, state, stateFile);

  stateFile = addState(state, properties, stateFile, config, parentState);

  stateFile = addReducerAndExport(stateFile, baseState);

  if (state === baseState) {
    stateFile = createSelectorsForState(state, properties, stateFile);
    let reducer: Program = getOrCreateReducerFile(config);

    reducer = addStateToReducer(state, reducer, parentState);

    const newReducerFile: string = write(reducer);

    fs.writeFileSync(getReducerFileName(config), newReducerFile);
  }

  const newStateString: string = write(stateFile);

  fs.writeFileSync(getStateFileName(config, baseState), newStateString);
};
