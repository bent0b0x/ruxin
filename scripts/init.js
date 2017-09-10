/* @flow */
import {
  createDirIfNeeded,
  getCompleteStateDir,
  getReducerFileName,
  createFileIfNeeded,
  getTypesFileName
} from "util/dir";

import type { Project } from "types";

export default (config: Project) => {
  createFileIfNeeded(getTypesFileName(config));
  createDirIfNeeded(getCompleteStateDir(config));
  createFileIfNeeded(getReducerFileName(config));
};
