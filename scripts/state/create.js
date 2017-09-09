/* @flow */
import fs from "fs";
import { ASTTypes } from "constants/ApplicationConstants";
import createImport from "util/createImport";
import createExport from "util/createExport";
import addRequiredImports from "util/addRequiredImports";
import createRecordSubclass from "util/createRecordSubclass";
import { generate } from "astring";
import prettier from "prettier";
import findLastIndex from "lodash.findlastindex";
import toAST from "to-ast";

const acorn = require("acorn");

import type {
  Project,
  StateProperties,
  ImportDeclaration,
  ASTItem,
  Program,
  RequiredImport,
  RequiredExport,
  VariableDeclarator,
  ExportNamedDeclaration,
  Property,
  ClassDeclaration
} from "types";

const requiredImports: Array<RequiredImport> = [
  {
    module: "immutable",
    imports: ["Record"]
  },
  {
    module: "redux-actions",
    imports: ["handleActions", "createAction"]
  }
];

const requiredExports: Array<RequiredExport> = [
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

const getCompleteStateDir = (config: Project): string =>
  `${config.baseDir}${config.stateDir}`;

const getStateFileName = (config: Project, state: string): string =>
  `${getCompleteStateDir(config)}/${state}.js`;

const getOrCreateStateFile = (state: string, config: Project): Program => {
  const completeStateDir: string = getCompleteStateDir(config);
  if (!fs.existsSync(completeStateDir)) {
    fs.mkdirSync(completeStateDir);
  }

  const stateFileName = getStateFileName(config, state);

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

  return acorn.parse(newStateFile, {
    sourceType: "module"
  });
};

const getStateIndexInBody = (stateFile: Program): number =>
  stateFile.body.findIndex(
    (item: ASTItem | ExportNamedDeclaration) =>
      item.type === ASTTypes.ExportNamedDeclaration &&
      ((item: any): ExportNamedDeclaration).declaration.declarations[0].id
        .name === "State"
  );

const addRequiredExports = (
  state: string,
  stateFile: Program,
  config: Project
): Program => {
  const lastImportIndex: number = findLastIndex(
    stateFile.body,
    (item: ASTItem) => item.type === ASTTypes.ImportDeclaration
  );

  const newStateFile: Program = Object.assign({}, stateFile);

  let insertIndex: number = lastImportIndex === -1 ? 0 : lastImportIndex;

  requiredExports.forEach((requiredExport: RequiredExport, index: number) => {
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

  const stateIndex: number = getStateIndexInBody(newProgram);
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
    (item: Property) => {
      return item.key.name === state;
    }
  );

  if (!existingStateExport) {
    (mainStateExport: any).declaration.declarations[0].init.properties.unshift({
      type: ASTTypes.Property,
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
  config: Project
): void => {
  let stateFile: Program = getOrCreateStateFile(state, config);
  stateFile = addRequiredExports(state, stateFile, config);
  stateFile = addState(state, properties, stateFile);

  const newStateString: string = prettier.format(generate(stateFile));

  fs.writeFileSync(getStateFileName(config, state), newStateString);
};
