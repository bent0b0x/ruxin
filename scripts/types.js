/* @flow */
import { ASTTypes } from "constants/ApplicationConstants";

export type Project = {|
  baseDir: string,
  stateDir: string
|};

export type StateProperties = {|
  [key: string]: string
|};

export type RequiredImport = {
  module: string,
  imports: Array<string>
};

export type ASTType = $Keys<typeof ASTTypes>;

export type ASTItem = {
  type: ASTType,
  start: number,
  end: number
};

export type Literal = ASTItem & {
  value: string,
  raw: string
};

export type Identifier = ASTItem & {
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
  source: Literal
};

export type Program = ASTItem & {
  type: ASTTypes.Program,
  body: Array<ASTItem>,
  sourceType: "module"
};
