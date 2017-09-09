/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";

import type {
  ASTItem,
  Program,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  VariableDeclaration
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
