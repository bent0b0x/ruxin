/* @flow */
import generate from "babel-generator";
import prettier from "prettier";

import type { Program } from "types";

export default (program: Program): string =>
  prettier.format(generate(program).code);
