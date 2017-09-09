/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";

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
  ClassDeclaration,
  ObjectProperty
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
