/* @flow */
import generate from "babel-generator";
import prettier from "prettier";

import type { Program } from "types";

const flowPragma = "/* @flow */";

const addFlowPragma = (code: string): string => {
  let formattedCode: string = code;
  const flowStart: number = formattedCode.indexOf(flowPragma);
  const startsWithFlow = flowStart !== -1 && flowStart <= flowPragma.length;

  if (startsWithFlow) {
    formattedCode = formattedCode.slice(flowStart + flowPragma.length).trim();
  }

  console.log(formattedCode);

  return `${flowPragma}\n${formattedCode}`;
};

export default (program: Program): string =>
  prettier.format(addFlowPragma(generate(program).code));
