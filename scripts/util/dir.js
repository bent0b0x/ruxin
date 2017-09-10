/* @flow */
import fs from "fs";

import type { Project } from "types";

export const createDirIfNeeded = (dirName: string): void => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
};

export const getCompleteStateDir = (config: Project): string =>
  `${config.baseDir}${config.stateDir}`;

export const getStateFileName = (config: Project, state: string): string =>
  `${getCompleteStateDir(config)}/${state}.js`;
