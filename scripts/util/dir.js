/* @flow */
import fs from "fs";

import type { Project } from "types";

export const createDirIfNeeded = (dirName: string): void => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
};

export const getCompleteStateDir = (config: Project): string =>
  `${config.baseDir}${config.stateDir || "/state"}`;

export const getStateFileName = (config: Project, state: string): string =>
  `${getCompleteStateDir(config)}/${state}.js`;

export const getReducerFileName = (config: Project): string =>
  `${getCompleteStateDir(config)}/index.js`;

export const createFileIfNeeded = (fileName: string): void => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, "");
  }
};
