/* @flow */
import fs from "fs";
import prettier from "prettier";

import type { Project } from "types";

export const createDirIfNeeded = (dirName: string): void => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
};

export const getScriptsPath = (): string => "/app/scripts";

export const getCompleteStateDir = (config: Project): string =>
  `${config.baseDir}${config.stateDir || getScriptsPath() + "/state"}`;

export const getStateFileName = (config: Project, state: string): string =>
  `${getCompleteStateDir(config)}/${state}.js`;

export const getReducerFileName = (config: Project): string =>
  `${getCompleteStateDir(config)}/index.js`;

export const getComponentsPath = (): string => `${getScriptsPath()}/components`;

export const getCompleteComponentsDir = (config: Project): string =>
  `${config.baseDir}${getComponentsPath()}`;

export const getContainersPath = (): string => `${getScriptsPath()}/containers`;

export const getCompleteContainersDir = (config: Project): string =>
  `${config.baseDir}${getContainersPath()}`;

export const getTypesFileName = (config: Project): string =>
  `${config.baseDir}${getScriptsPath()}/types.js`;

export const createFileIfNeeded = (
  fileName: string,
  initContents = ""
): void => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, initContents);
  }
};
