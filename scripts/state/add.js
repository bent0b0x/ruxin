/* @flow */
import fs from "fs";
import {
  createDirIfNeeded,
  getCompleteStateDir,
  getStateFileName,
  readFileSync
} from "util/dir";
import {
  findExportIndex,
  findVariableDeclarationIndex,
  findClassDeclarationIndex,
  addExpressionToProgram,
  addShorthandExport,
  addImmutableImport,
  addImportToModule
} from "util/program";
import toAST from "util/toAST";
import parse from "../parser";
import write from "../write";
import camelCase from "camelcase";
import forEach from "lodash.foreach";
import { ASTTypes } from "constants/ApplicationConstants";
import { createSelectorsForState } from "./create";

import type {
  Project,
  Program,
  ExportNamedDeclaration,
  VariableDeclaration,
  VariableDeclarator,
  ObjectProperty,
  StateProperties,
  StateProperty,
  ClassProperty,
  ClassDeclaration
} from "types";

export const addProperties = (
  state: string,
  properties: StateProperties,
  config: Project,
  parentState?: string
): void => {
  const stateFile: string = parentState || state;
  const stateFileName: string = getStateFileName(config, stateFile);

  const fileContents: string = readFileSync(stateFileName);

  let program: Program = parse(fileContents).program;

  const classIndex: number = findClassDeclarationIndex(program, state);

  if (classIndex === -1) {
    throw new Error(`Cannot find existing declaration for ${state}!`);
  }

  const classDec: ClassDeclaration = ((program.body[
    classIndex
  ]: any): ClassDeclaration);

  forEach(properties, (property: StateProperty, key: string) => {
    const existingProp: ?ClassProperty = classDec.body.body.find(
      (existingProperty: ClassProperty) => existingProperty.key.name === key
    );

    if (existingProp) {
      throw new Error(
        `Property "${key}" already exists! Please delete it before modifying.`
      );
    }

    classDec.body.body.push(
      toAST(`class A {\n${key}: ${property.type};}`).body.body[0]
    );
    (classDec: any).superClass.arguments[0].properties.push({
      type: ASTTypes.ObjectProperty,
      key: {
        type: ASTTypes.Identifier,
        name: key
      },
      value: toAST(property.default),
      kind: "init"
    });
    addImmutableImport(program, property.type);
  });

  if (!parentState) {
    program = createSelectorsForState(state, properties, program);
  }

  const newProgramContents: string = write(program);

  fs.writeFileSync(stateFileName, newProgramContents);
};

const getActionConstantName = (action: string): string => action.toUpperCase();

const getActionConstantValue = (state: string, action: string): string =>
  `${state.toUpperCase()}_${action}`;

const addActionConstant = (
  state: string,
  action: string,
  program: Program
): Program => {
  program = (Object.assign({}, program): Program);
  let actionConstantsExportIndex: number = findExportIndex(
    program,
    "ActionConstants"
  );

  if (actionConstantsExportIndex === -1) {
    throw new Error("ActionConstants export is missing");
  }

  const actionConstantIndex: number = findVariableDeclarationIndex(
    program,
    action
  );

  if (actionConstantIndex === -1) {
    addExpressionToProgram(
      `const ${action}: string = "${getActionConstantValue(state, action)}";`,
      program,
      actionConstantsExportIndex
    );

    actionConstantsExportIndex += 1;
  }

  const actionConstantsExport: ExportNamedDeclaration = ((program.body[
    actionConstantsExportIndex
  ]: any): ExportNamedDeclaration);

  addShorthandExport(actionConstantsExport, action);

  return program;
};

const stubReducer = (
  state: string,
  action: string,
  program: Program
): Program => {
  const reducersIndex: number = findVariableDeclarationIndex(
    program,
    "reducer"
  );
  if (reducersIndex === -1) {
    throw new Error("Cannot find reducers");
  }

  const reducer: VariableDeclarator = ((program.body[
    reducersIndex
  ]: any): VariableDeclaration).declarations[0];

  const actionConstantName: string = getActionConstantName(action);

  const reducerProperties: Array<ObjectProperty> = reducer.init.properties;
  if (
    !reducerProperties.find(
      (property: ObjectProperty): boolean =>
        property.key.name === actionConstantName
    )
  ) {
    reducer.init.properties.push(
      toAST(
        `{[${actionConstantName}]: (state: ${state}, action: Action<void>): ${state} => {
      return state;
    }}`
      ).properties[0]
    );
  }

  return program;
};

export const addAction = (
  state: string,
  action: string,
  config: Project
): void => {
  action = getActionConstantName(action);
  const completeStateDir: string = getCompleteStateDir(config);
  createDirIfNeeded(completeStateDir);

  const stateFileName: string = getStateFileName(config, state);

  if (!fs.existsSync(stateFileName)) {
    throw new Error("State does not exist");
  }

  const fileContents: string = readFileSync(stateFileName);

  let contents: Program = parse(fileContents).program;

  addImportToModule(contents, "createAction", "redux-actions");

  let actionsExportIndex: number = findExportIndex(contents, "Actions");

  if (actionsExportIndex === -1) {
    throw new Error("Actions export is missing");
  }

  const actionCreatorName: string = camelCase(action);

  const actionIndex: number = findVariableDeclarationIndex(
    contents,
    actionCreatorName
  );

  if (actionIndex === -1) {
    contents = (Object.assign({}, contents): Program);

    addExpressionToProgram(
      `const ${actionCreatorName} = createAction(${action});`,
      contents,
      actionsExportIndex
    );

    actionsExportIndex += 1;
  }

  const actionsExport: ExportNamedDeclaration = ((contents.body[
    actionsExportIndex
  ]: any): ExportNamedDeclaration);

  addShorthandExport(actionsExport, actionCreatorName);

  contents = addActionConstant(state, action, contents);

  contents = stubReducer(state, action, contents);

  const newStateString: string = write(contents);

  fs.writeFileSync(getStateFileName(config, state), newStateString);
};
