/* @flow */
import fs from "fs";
import {
  createDirIfNeeded,
  getCompleteStateDir,
  getStateFileName
} from "util/dir";
import {
  findExportIndex,
  findVariableDeclarationIndex,
  addExpressionToProgram,
  addShorthandExport
} from "util/program";
import parse from "../parser";
import camelCase from "camelcase";
import generate from "babel-generator";
import prettier from "prettier";

import type { Project, Program, ExportNamedDeclaration } from "types";

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
      `const ${action}: string = "${state.toUpperCase()}_${action}";`,
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

export const addAction = (
  state: string,
  action: string,
  config: Project
): void => {
  action = action.toUpperCase();
  const completeStateDir: string = getCompleteStateDir(config);
  createDirIfNeeded(completeStateDir);

  const stateFileName: string = getStateFileName(config, state);

  if (!fs.existsSync(stateFileName)) {
    throw new Error("State does not exist");
  }

  const fileContents: string = fs.readFileSync(stateFileName, {
    encoding: "utf8"
  });

  let contents: Program = parse(fileContents).program;

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

  const newStateString: string = prettier.format(generate(contents).code);

  fs.writeFileSync(getStateFileName(config, state), newStateString);
};
