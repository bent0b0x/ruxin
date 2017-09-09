/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";
import type {
  Project,
  StateProperties,
  ImportDeclaration,
  ImportSpecifier,
  Identifier,
  StringLiteral
} from "types";

export default (module: string, imports: Array<string>): ImportDeclaration => {
  let startLocation: number = 0;
  const importSpecifiers: Array<
    ImportSpecifier
  > = imports.map((importName: string, index: number): ImportSpecifier => {
    const specifierStart: number =
      startLocation + (index === 0 ? 0 : imports[index - 1].length + 2);
    const specifierEnd = specifierStart + importName.length + 2;

    startLocation = specifierEnd + 1;

    const identifier: Identifier = {
      type: ASTTypes.Identifier,
      start: specifierStart,
      end: specifierEnd,
      name: importName
    };

    return {
      type: ASTTypes.ImportSpecifier,
      start: specifierStart,
      end: specifierEnd,
      imported: identifier,
      local: identifier
    };
  });

  const finalEndLocation: number = startLocation + 1 + module.length + 2;

  const source: StringLiteral = {
    type: ASTTypes.StringLiteral,
    start: startLocation + 1,
    end: finalEndLocation,
    value: module,
    raw: `\'${module}\'`
  };

  return {
    type: ASTTypes.ImportDeclaration,
    start: 0,
    end: finalEndLocation,
    specifiers: importSpecifiers,
    source
  };
};
