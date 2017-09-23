/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";
import type { StateProperties, StateProperty, ClassDeclaration } from "types";
import map from "lodash.map";
import toAST from "util/toAST";

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
    body: (() => {
      const result = toAST(
        `class A {\n${map(
          props,
          (prop: StateProperty, name: string) => `${name}: ${prop.type}`
        ).join(";\n")}}`
      ).body.body;
      return result;
    })(),
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
        properties: map(props, (prop: StateProperty, name: string) => ({
          type: ASTTypes.ObjectProperty,
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
