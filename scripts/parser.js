/* @flow */
import { removeFlowPragma } from "./write";

const babylon = require("babylon");

export default (input: string) =>
  babylon.parse(removeFlowPragma(input), {
    sourceType: "module",
    plugins: ["flow"]
  });
