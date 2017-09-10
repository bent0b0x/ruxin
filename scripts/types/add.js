/* @flow */
import fs from "fs";
import { createFileIfNeeded, getTypesFileName } from "util/dir";
import { findTypeExportIndex } from "util/program";
import toAST from "util/toAST";
import parse from "../parser";
import reduce from "lodash.reduce";
import generate from "babel-generator";
import prettier from "prettier";

import type {
  Project,
  StateProperties,
  Program,
  ExportNamedDeclaration,
  ClassProperty
} from "types";

export const addType = (
  type: string,
  properties: StateProperties,
  config: Project
): void => {
  const typesFileName: string = getTypesFileName(config);
  createFileIfNeeded(getTypesFileName(config));

  const fileContents: string = fs.readFileSync(typesFileName, {
    encoding: "utf8"
  });

  let contents: Program = parse(fileContents).program;

  if (findTypeExportIndex(contents, type) === -1) {
    const typeExport: ExportNamedDeclaration = toAST(
      `export type ${type} = {
      ${reduce(
        properties,
        (types: string, property: ClassProperty, key: string): string => {
          return `${types}\n${key}: ${property.type};`;
        },
        ""
      )}
    };`,
      true
    );

    contents.body.push(typeExport);
  }

  fs.writeFileSync(typesFileName, prettier.format(generate(contents).code));
};
