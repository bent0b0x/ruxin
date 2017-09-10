import createState from "scripts/state/create";
import { addAction } from "scripts/state/add";

const config = {
  baseDir: "/Users/bbaum/Desktop/dev/scratch",
  stateDir: "/state"
};

createState(
  "Baz",
  {
    id: {
      type: "Array<Foo>",
      default: []
    },
    name: {
      type: "string",
      default: ""
    }
  },
  config
);

createState(
  "Chicken",
  {
    id: {
      type: "Array<Foo>",
      default: []
    },
    name: {
      type: "string",
      default: ""
    }
  },
  config,
  "Baz"
);

addAction("Baz", "TEST_ACTION", config);

addAction("Baz", "second_action", config);
