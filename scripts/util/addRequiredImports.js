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
  const includeFlowPragma: boolean =
    stateFile.body &&
    stateFile.body[0] &&
    stateFile.body[0].leadingComments &&
    stateFile.body[0].leadingComments.length &&
    stateFile.body[0].leadingComments[0].value.trim() === "@flow";
  requiredImports.forEach((requiredImport: RequiredImport, index: number) => {
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
        requiredImport.imports,
        requiredImport.default,
        requiredImport.type,
        includeFlowPragma && index === 0
          ? stateFile.body[0].leadingComments
          : undefined
      );
      if (includeFlowPragma && index === 0) {
        delete stateFile.body[0].leadingComments;
      }
      lengthIncrease += newImport.end - newImport.start;
      imports.push(newImport);
    }
  });
  return Object.assign({}, stateFile, {
    end: stateFile.end + lengthIncrease,
    body: imports.concat(stateFile.body)
  });
};
