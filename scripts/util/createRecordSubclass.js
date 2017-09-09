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
  Property,
  ClassProperty,
  ClassDeclaration
} from "types";
import toAST from "to-ast";
import map from "lodash.map";

export default (name: string, props: StateProperties): ClassDeclaration => ({
  type: ASTTypes.ClassDeclaration,
  id: {
    type: ASTTypes.Identifier,
    name,
    start: 0,
    end: 0
  },
  start: 0,
  end: 0,
  body: {
    type: ASTTypes.ClassBody,
    body: map(props, (prop: ClassProperty, name: string) => ({
      type: ASTTypes.ClassProperty,
      key: {
        type: ASTTypes.Identifier,
        name: name
      },
      value: null,
      typeAnnotation: {
        type: ASTTypes.TypeAnnotation
      }
    })),
    start: 0,
    end: 0
  },
  superClass: {
    type: ASTTypes.CallExpression,
    callee: {
      type: ASTTypes.Identifier,
      name: "Record",
      start: 0,
      end: 0
    },
    arguments: [
      {
        type: ASTTypes.ObjectExpression,
        properties: map(props, (prop: ClassProperty, name: string) => ({
          type: ASTTypes.Property,
          key: {
            type: ASTTypes.Identifier,
            name: name
          },
          value: toAST(prop.default),
          kind: "init"
        })),
        start: 0,
        end: 0
      }
    ],
    start: 0,
    end: 0
  }
});
