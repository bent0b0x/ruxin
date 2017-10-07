/* @flow */
import {
  createDirIfNeeded,
  getCompleteStateDir,
  getReducerFileName,
  createFileIfNeeded,
  getTypesFileName,
  setPackageDetails
} from "util/dir";
import copyDir from "copy-dir";
import path from "path";
import exec from "util/exec";

import type { Project } from "types";

export default (config: Project) => {
  exec(`mkdir ${config.baseDir}`);

  copyDir.sync(path.resolve(__dirname, "../static/"), config.baseDir);

  setPackageDetails(config);

  exec(`cd ${config.baseDir} && yarn && cd ..`);

  createFileIfNeeded(getTypesFileName(config));
  createDirIfNeeded(getCompleteStateDir(config));
  createFileIfNeeded(getReducerFileName(config));
};
