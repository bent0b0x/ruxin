/* @flow */
import generate from "babel-generator";
import prettier from "prettier";

import type { Program, File } from "types";

const flowPragma = "/* @flow */";

export const removeFlowPragma = (code: string): string => {
  let formattedCode: string = code;
  const flowStart: number = formattedCode.indexOf(flowPragma);
  const startsWithFlow = flowStart !== -1 && flowStart <= flowPragma.length;

  if (startsWithFlow) {
    formattedCode = formattedCode.slice(flowStart + flowPragma.length).trim();
  }

  return formattedCode;
};

const addFlowPragma = (code: string): string => {
  return `${flowPragma}\n${removeFlowPragma(code)}`;
};

export default (content: Program | File): string =>
  prettier.format(addFlowPragma(generate(content).code), {
    parser: "babylon"
  });
