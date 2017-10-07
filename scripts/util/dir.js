/* @flow */
import fs from "fs";

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

const getCompletePackageJSONPath = (config: Project): string =>
  `${config.baseDir}/package.json`;

export const setPackageDetails = (config: Project): void => {
  const packagePath: string = getCompletePackageJSONPath(config);

  if (!fs.existsSync(packagePath)) {
    return;
  }

  const packageObj: Object = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  packageObj.name = config.name;
  packageObj.description = config.description;

  fs.writeFileSync(packagePath, JSON.stringify(packageObj, null, "\t"));
};

export const getTypesFileName = (config: Project): string =>
  `${config.baseDir}${getScriptsPath()}/types.js`;

export const createFileIfNeeded = (
  fileName: string,
  initContents: string = ""
): void => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, initContents);
  }
};
