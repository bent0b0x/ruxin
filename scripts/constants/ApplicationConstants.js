/* @flow */
import type { RequiredImport, RequiredExport } from "types";

export const ASTTypes: Object = {
  Program: "Program",
  ImportSpecifier: "ImportSpecifier",
  ImportDeclaration: "ImportDeclaration",
  Identifier: "Identifier",
  StringLiteral: "StringLiteral",
  NumbericLiteral: "NumbericLiteral",
  BooleanLiteral: "BooleanLiteral",
  BinaryExpression: "BinaryExpression",
  ExportNamedDeclaration: "ExportNamedDeclaration",
  VariableDeclaration: "VariableDeclaration",
  VariableDeclarator: "VariableDeclarator",
  Identifier: "Identifier",
  ObjectExpression: "ObjectExpression",
  ObjectProperty: "ObjectProperty",
  ObjectMethod: "ObjectMethod",
  ExportDefaultDeclaration: "ExportDefaultDeclaration",
  CallExpression: "CallExpression",
  ClassDeclaration: "ClassDeclaration",
  TypeAnnotation: "TypeAnnotation",
  StringTypeAnnotation: "StringTypeAnnotation",
  NumberTypeAnnotation: "NumberTypeAnnotation",
  BooleanTypeAnnotation: "BooleanTypeAnnotation",
  GenericTypeAnnotation: "GenericTypeAnnotation",
  ClassProperty: "ClassProperty",
  ClassBody: "ClassBody",
  UnaryExpression: "UnaryExpression"
};

export const RequiredImports: Array<RequiredImport> = [
  {
    module: "immutable",
    imports: ["Record"]
  },
  {
    module: "redux-actions",
    imports: ["handleActions", "createAction"]
  }
];

export const RequiredExports: Array<RequiredExport> = [
  {
    name: "ActionConstants",
    init: {}
  },
  {
    name: "Actions",
    init: {}
  },
  {
    name: "State",
    init: {}
  },
  {
    name: "Selectors",
    init: {}
  }
];
