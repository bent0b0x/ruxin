/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";
import createImport from "util/createImport";

import type {
  ImportDeclaration,
  ASTItem,
  Program,
  RequiredImport
} from "types";

export default (
  requiredImports: Array<RequiredImport>,
  stateFile: Program
): Program => {
  const imports: Array<ImportDeclaration> = [];
  let lengthIncrease: number = 0;
  requiredImports.forEach((requiredImport: RequiredImport) => {
    if (
      !stateFile.body.find((item: ASTItem): boolean => {
        if (item.type === ASTTypes.ImportDeclaration) {
          const declaration: ImportDeclaration = (item: any);
          return declaration.source.value === requiredImport.module;
        }
        return false;
      })
    ) {
      const newImport: ImportDeclaration = createImport(
        requiredImport.module,
        requiredImport.imports
      );
      lengthIncrease += newImport.end - newImport.start;
      imports.push(newImport);
    }
  });
  return Object.assign({}, stateFile, {
    end: stateFile.end + lengthIncrease,
    body: imports.concat(stateFile.body)
  });
};
