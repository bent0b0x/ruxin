/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";
import toAST from "util/toAST";

import type {
  ASTItem,
  Program,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  VariableDeclaration,
  ObjectProperty,
  VariableDeclarator,
  ObjectExpression
} from "types";

export const findExportIndex = (
  stateFile: Program,
  exportName: string
): number =>
  stateFile.body.findIndex(
    (item: ASTItem | ExportNamedDeclaration) =>
      item.type === ASTTypes.ExportNamedDeclaration &&
      ((item: any): ExportNamedDeclaration).declaration.declarations[0].id
        .name === exportName
  );

export const findTypeExportIndex = (
  stateFile: Program,
  typeName: string
): number =>
  stateFile.body.findIndex(
    (item: ASTItem | ExportNamedDeclaration) =>
      item.type === ASTTypes.ExportNamedDeclaration &&
      ((item: any): ExportNamedDeclaration).declaration.type ===
        ASTTypes.TypeAlias &&
      (item: any).declaration.id.name === typeName
  );

export const findDefaultExportIndex = (stateFile: Program): number =>
  stateFile.body.findIndex(
    (item: ASTItem | ExportDefaultDeclaration) =>
      item.type === ASTTypes.ExportDefaultDeclaration
  );

export const findVariableDeclarationIndex = (
  stateFile: Program,
  decName: string
): number =>
  stateFile.body.findIndex(
    (item: ASTItem | VariableDeclaration) =>
      item.type === ASTTypes.VariableDeclaration &&
      ((item: any): VariableDeclaration).declarations[0].id.name === decName
  );

export const addExpressionToProgram = (
  expression: string | ASTItem,
  program: Program,
  index: number
): void => {
  program.body = [
    ...program.body.slice(0, index),
    typeof expression === "string" ? toAST(expression, true) : expression,
    ...program.body.slice(index)
  ];
};

export const addShorthandExport = (
  exportDef: ExportNamedDeclaration,
  name: string
): void => {
  const existingExport: ?VariableDeclarator = (exportDef: any).declaration.declarations[0].init.properties.find(
    (item: ObjectProperty) => item.key.name === name
  );
  if (!existingExport) {
    (exportDef: any).declaration.declarations[0].init.properties.push({
      type: ASTTypes.ObjectProperty,
      key: {
        type: ASTTypes.Identifier,
        name: name
      },
      value: {
        type: ASTTypes.Identifier,
        name: name
      },
      kind: "init",
      shorthand: true
    });
  }
};

export const addShorthandProperty = (
  expression: ObjectExpression,
  name: string
): void => {
  const existingProp: ?ObjectProperty = expression.properties.find(
    (prop: ObjectProperty) => prop.key.name === name
  );

  if (!existingProp) {
    (expression: any).properties.push({
      type: ASTTypes.ObjectProperty,
      key: {
        type: ASTTypes.Identifier,
        name: name
      },
      value: {
        type: ASTTypes.Identifier,
        name: name
      },
      kind: "init",
      shorthand: true
    });
  }
};
