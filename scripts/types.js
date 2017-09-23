/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";

export type Foo = {};

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
  imports: Array<string>,
  default?: boolean,
  type?: boolean
};

export type RequiredExport = {
  name: string,
  init: any
};

export type ASTType = $Keys<typeof ASTTypes>;

export type ASTItem = {
  type: ASTType,
  start: number,
  end: number,
  leadingComments?: Array<CommentBlock | CommentLine>
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

export type Identifier = ASTItem & {
  type: ASTTypes.Identifier,
  name: string
};

export type ImportDefaultSpecifier = ASTItem & {
  type: ASTTypes.ImportDefaultSpecifier,
  imported: Identifier,
  local: Identifier
};

export type ImportSpecifier = ASTItem & {
  type: ASTTypes.ImportSpecifier,
  imported: Identifier,
  local: Identifier
};

export type ImportDeclaration = ASTItem & {
  type: ASTTypes.ImportDeclaration,
  specifiers: Array<ImportDefaultSpecifier | ImportSpecifier>,
  source: StringLiteral
};

export type ObjectProperty = ASTItem & {
  type: ASTTypes.ObjectProperty,
  key: Identifier,
  value: ASTItem
};

export type ObjectExpression = ASTItem & {
  type: ASTTypes.ObjectExpression,
  properties: Array<ObjectProperty>
};

export type ObjectTypeProperty = ASTItem & {
  type: ASTTypes.ObjectTypeProperty,
  key: Identifier,
  value: ASTItem
};

export type ObjectTypeAnnotation = ASTItem & {
  type: ASTTypes.ObjectTypeAnnotation,
  properties: Array<ObjectTypeProperty>
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
  kind: VariableDeclarationKind,
  right?: ObjectTypeAnnotation
};

export type ExportNamedDeclaration = ASTItem & {
  type: ASTTypes.ExportNamedDeclaration,
  declaration: VariableDeclaration
};

export type ExportDefaultDeclaration = ASTItem & {
  type: ASTTypes.ExportDefaultDeclaration,
  declaration: ASTItem
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

export type CommentLine = ASTItem & {
  type: ASTTypes.CommentLine,
  value: string
};

export type CommentBlock = CommentLine;

export type Program = ASTItem & {
  type: ASTTypes.Program,
  body: Array<ASTItem>,
  sourceType: "module"
};
