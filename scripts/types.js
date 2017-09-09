/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";

export type ClassProperty = {
  type: string,
  default: any
};

export type Project = {|
  baseDir: string,
  stateDir: string
|};

export type StateProperties = {
  [key: string]: ClassProperty
};

export type RequiredImport = {
  module: string,
  imports: Array<string>
};

export type RequiredExport = {
  name: string,
  init: any
};

export type ASTType = $Keys<typeof ASTTypes>;

export type ASTItem = {
  type: ASTType,
  start: number,
  end: number
};

export type StringLiteral = ASTItem & {
  type: ASTTypes.StringLiteral,
  value: string,
  raw: string
};

export type NumericLiteral = ASTItem & {
  type: ASTTypes.NumericLiteral,
  value: number
};

export type BooleanLiteral = ASTItem & {
  type: ASTTypes.BooleanLiteral,
  value: boolean
};

type Literal = StringLiteral | NumericLiteral | BooleanLiteral;

export type Identifier = ASTItem & {
  type: ASTTypes.Identifier,
  name: string
};

export type ImportSpecifier = ASTItem & {
  type: ASTTypes.ImportSpecifier,
  imported: Identifier,
  local: Identifier
};

export type ImportDeclaration = ASTItem & {
  type: ASTTypes.ImportDeclaration,
  specifiers: Array<ImportSpecifier>,
  source: StringLiteral
};

export type ObjectProperty = ASTItem & {
  type: ASTTypes.ObjectProperty,
  key: Identifier,
  value: Literal
};

export type ObjectExpression = ASTItem & {
  type: ASTTypes.ObjectExpression,
  properties: Array<ObjectProperty>
};

export type VariableDeclarator = ASTItem & {
  type: ASTTypes.VariableDeclarator,
  id: Identifier,
  init: ObjectExpression
};

type VariableDeclarationKind = "let" | "const" | "var";

export type VariableDeclaration = ASTItem & {
  type: ASTTypes.VariableDeclaration,
  declarations: Array<VariableDeclarator>,
  kind: VariableDeclarationKind
};

export type ExportNamedDeclaration = ASTItem & {
  type: ASTTypes.ExportNamedDeclaration,
  declaration: VariableDeclaration
};

export type ClassBody = ASTItem & {
  type: ASTTypes.ClassBody,
  body: Array<ClassProperty>
};

export type CallExpression = ASTItem & {
  type: ASTTypes.CallExpression,
  callee: Identifier,
  arguments: Array<ASTItem>
};

export type ClassDeclaration = ASTItem & {
  type: ASTTypes.ClassDeclaration,
  id: Identifier,
  body: ClassBody,
  superClass: Identifier | CallExpression
};

export type Program = ASTItem & {
  type: ASTTypes.Program,
  body: Array<ASTItem>,
  sourceType: "module"
};
