/* @flow */
import fs from "fs";

export const createDirIfNeeded = (dirName: string): void => {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
  }
};
