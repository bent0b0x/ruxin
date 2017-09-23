/* @flow */
import fs from "fs";
import { createFileIfNeeded, getTypesFileName } from "util/dir";
import { findTypeExportIndex } from "util/program";
import { ASTTypes } from "constants/ApplicationConstants";
import toAST from "util/toAST";
import parse from "../parser";
import reduce from "lodash.reduce";
import generate from "babel-generator";
import prettier from "prettier";

import type {
  Project,
  StateProperties,
  Program,
  ExportNamedDeclaration,
  ClassProperty,
  ObjectTypeProperty,
  ObjectTypeAnnotation,
  VariableDeclaration,
  TypeAlias
} from "types";

export const addType = (
  type: string,
  properties: StateProperties,
  config: Project,
  addToRoot: boolean
): void => {
  const typesFileName: string = getTypesFileName(config);
  createFileIfNeeded(getTypesFileName(config));

  const fileContents: string = fs.readFileSync(typesFileName, {
    encoding: "utf8"
  });

  let contents: Program = parse(fileContents).program;

  if (findTypeExportIndex(contents, type) === -1) {
    const typeExport: ExportNamedDeclaration = toAST(
      `export type ${type} = {
      ${reduce(
        properties,
        (types: string, property: ClassProperty, key: string): string => {
          return `${types}\n${key}: ${property.type};`;
        },
        ""
      )}
    };`,
      true
    );

    if (addToRoot) {
      contents = updateRootStateType(type, contents);
    }

    contents.body.push(typeExport);
  }

  fs.writeFileSync(typesFileName, prettier.format(generate(contents).code));
};

const updateRootStateType = (state: string, program: Program): Program => {
  const reducerExportIndex: number = findTypeExportIndex(program, "RootState");

  if (reducerExportIndex === -1) {
    throw new Error("RootState type is missing");
  }

  console.log(JSON.stringify(program.body[reducerExportIndex]));

  const typeExport: ExportNamedDeclaration = ((program.body[
    reducerExportIndex
  ]: any): ExportNamedDeclaration);

  const existingStateType: ?ObjectTypeProperty =
    ((typeExport.declaration: any): TypeAlias).right &&
    ((typeExport.declaration: any): TypeAlias).right.properties.find(
      (property: ObjectTypeProperty) => property.key.name === state
    );

  if (!existingStateType) {
    const right: ?ObjectTypeAnnotation = ((typeExport.declaration: any): VariableDeclaration)
      .right;
    console.log("right: ", right);

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
            name: state
          }
        }
      });
    }
  }

  return program;
};
