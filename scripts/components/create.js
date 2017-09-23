/* @flow */
import { getCompleteComponentsDir } from "util/dir";
import fs from "fs";
import write from "../write";
import parse from "../parser";

import type { Project } from "types";

export const createComponent = (state: string, config: Project): void => {
  const componentsDir: string = getCompleteComponentsDir(config);
  const componentFileName: string = `${componentsDir}/${state}.js`;

  const componentExists: boolean = fs.existsSync(componentFileName);

  if (componentExists) {
    throw new Error(`Component "${state}" already exists!`);
  }

  const newComponentContents: string = `
    import React from 'react';
    import styled from 'styled-components';

    type Props = {};
    type State = {};

    class ${state} extends React.Component<void, Props, State> {
      state: State;

      render() {
        return styled.div\`\`;
      }
    }
  `;

  const componentCode: string = write(parse(newComponentContents));

  fs.writeFileSync(componentFileName, componentCode);
};
