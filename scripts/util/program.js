/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";

import type { ASTItem, Program, ExportNamedDeclaration } from "types";

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
