/* @flow */
import { getCompleteContainersDir, getCompleteStateDir } from "util/dir";
import fs from "fs";
import write from "../write";
import parse from "../parser";

import type { Project } from "types";

export const createContainer = (
  name: string,
  state: string,
  parentState: string,
  config: Project
): void => {
  const containersDir: string = getCompleteContainersDir(config);
  const containerFilename: string = `${containersDir}/${name}.js`;

  const stateToUse: string = parentState || state;

  if (
    stateToUse &&
    !fs.existsSync(`${getCompleteStateDir(config)}/${stateToUse}.js`)
  ) {
    throw new Error(`The file for state "${stateToUse}" does not exist`);
  }

  const containerExists: boolean = fs.existsSync(containerFilename);

  if (containerExists) {
    throw new Error(`Container "${name}" already exists!`);
  }

  const newContainerContents: string = `
    import { connect } from 'react-redux';
    import ${name} from 'components/${name}';

    import type { RootState, Action } from 'scripts/types';
    import type { Dispatch } from 'redux';

    const mapStateToProps = (state: RootState) => ({
      ${stateToUse ? `${name}: state.${name}` : ""}
    });
    const mapDispatchToProps = (dispatch: Dispatch<Action<*>>) => ({});

    export default connect(mapStateToProps, mapDispatchToProps)(${name})
  `;

  const containerCode: string = write(parse(newContainerContents));

  fs.writeFileSync(containerFilename, containerCode);
};
