/* @flow */
import { execSync } from "child_process";

export default (command: string): void => {
  execSync(command, {
    stdio: "inherit"
  });
};
