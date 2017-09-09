/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";
import type {
  Project,
  StateProperties,
  ImportDeclaration,
  ImportSpecifier,
  Identifier,
  Literal,
  ExportNamedDeclaration,
  Property
} from "types";
import toAST from "to-ast";

export default (
  name: string,
  init: Object,
  line: number = 4
): ExportNamedDeclaration => ({
  type: ASTTypes.ExportNamedDeclaration,
  start: 0,
  end: 0,
  loc: {
    start: {
      line
    }
  },
  declaration: {
    type: ASTTypes.VariableDeclaration,
    start: 0,
    end: 0,
    declarations: [
      {
        type: ASTTypes.VariableDeclarator,
        start: 0,
        end: 0,
        id: {
          type: ASTTypes.Identifier,
          start: 0,
          end: 0,
          name
        },
        init: toAST(init)
      }
    ],
    kind: "const"
  }
});
