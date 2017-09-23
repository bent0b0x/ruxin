/* @flow */
import { getCompleteComponentsDir, getCompleteStateDir } from "util/dir";
import fs from "fs";
import write from "../write";
import parse from "../parser";

import type { Project } from "types";

export const createComponent = (
  name: string,
  state: string,
  parentState: string,
  config: Project
): void => {
  const componentsDir: string = getCompleteComponentsDir(config);
  const componentFileName: string = `${componentsDir}/${name}.js`;

  const stateToUse: string = parentState || state;

  if (!fs.existsSync(`${getCompleteStateDir(config)}/${stateToUse}.js`)) {
    throw new Error(`The file for state "${stateToUse}" does not exist`);
  }

  const componentExists: boolean = fs.existsSync(componentFileName);

  if (componentExists) {
    throw new Error(`Component "${name}" already exists!`);
  }

  const newComponentContents: string = `
    import React from 'react';
    import styled from 'styled-components';
    ${state ? `import State from 'state/${stateToUse}';\n` : ""}
    type Props = {
      ${state ? state + ": State." + state : ""}
    };
    type ComponentState = {};

    class ${name} extends React.Component<void, Props, ComponentState> {
      state: ComponentState;

      render() {
        return styled.div\`\`;
      }
    }


    export default ${name}
  `;

  const componentCode: string = write(parse(newComponentContents));

  fs.writeFileSync(componentFileName, componentCode);
};
