/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";
import findLastIndex from "lodash.findlastindex";
import createExport from "util/createExport";

import type {
  ASTItem,
  Program,
  RequiredExport,
  VariableDeclarator
} from "types";

export default (
  requiredExports: Array<RequiredExport>,
  state: string,
  stateFile: Program
): Program => {
  const lastImportIndex: number = findLastIndex(
    stateFile.body,
    (item: ASTItem) => item.type === ASTTypes.ImportDeclaration
  );

  const newStateFile: Program = Object.assign({}, stateFile);

  let insertIndex: number = lastImportIndex === -1 ? 0 : lastImportIndex;

  requiredExports.forEach((requiredExport: RequiredExport) => {
    const exportExists: boolean = !!newStateFile.body.find(
      (item: ASTItem) =>
        item.type === ASTTypes.ExportNamedDeclaration &&
        !!(item: any).declaration.declarations.find(
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
