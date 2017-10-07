/* @flow */
import fs from "fs";
import { createFileIfNeeded, getTypesFileName, readFileSync } from "util/dir";
import {
  findTypeExportIndex,
  findImportIndex,
  addImportToModule
} from "util/program";
import { ASTTypes } from "constants/ApplicationConstants";
import createImport from "util/createImport";
import parse from "../parser";
import write from "../write";

import type {
  ImportDeclaration,
  Project,
  StateProperties,
  Program,
  ExportNamedDeclaration,
  ObjectTypeProperty,
  ObjectTypeAnnotation,
  VariableDeclaration
} from "types";

export const addStateToRootType = (
  type: string,
  properties: StateProperties,
  config: Project
): void => {
  const typesFileName: string = getTypesFileName(config);
  createFileIfNeeded(getTypesFileName(config));

  const fileContents: string = readFileSync(typesFileName);

  let contents: Program = parse(fileContents).program;

  contents = updateRootStateType(type, contents);

  fs.writeFileSync(typesFileName, write(contents));
};

const updateRootStateType = (state: string, program: Program): Program => {
  const reducerExportIndex: number = findTypeExportIndex(program, "RootState");

  if (reducerExportIndex === -1) {
    throw new Error("RootState type is missing");
  }

  const typeExport: ExportNamedDeclaration = ((program.body[
    reducerExportIndex
  ]: any): ExportNamedDeclaration);

  const existingStateType: ?ObjectTypeProperty =
    (typeExport.declaration: any).right &&
    (typeExport.declaration: any).right.properties.find(
      (property: ObjectTypeProperty) => property.key.name === state
    );

  if (!existingStateType) {
    const moduleName: string = `state/${state}`;

    const existingImportIndex: number = findImportIndex(program, moduleName);

    const importAlias: string = `${state}State`;

    if (existingImportIndex === -1) {
      const newImport: ImportDeclaration = createImport(
        moduleName,
        ["State"],
        undefined,
        undefined,
        importAlias
      );
      program.body.unshift(newImport);
    }

    addImportToModule(program, "State", moduleName);

    const right: ?ObjectTypeAnnotation = ((typeExport.declaration: any): VariableDeclaration)
      .right;

    if (right) {
      (right: any).properties.push({
        type: ASTTypes.ObjectTypeProperty,
        key: {
          type: ASTTypes.Identifier,
          name: state
        },
        value: {
          type: ASTTypes.GenericTypeAnnotation,
          id: {
            type: ASTTypes.Identifier,
            name: `${importAlias}.${state}`
          }
        }
      });
    }
  }

  return program;
};
