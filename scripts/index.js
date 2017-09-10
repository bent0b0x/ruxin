import createState from "scripts/state/create";
import { addAction } from "scripts/state/add";
import init from "scripts/init";

const config = {
  baseDir: "/Users/bbaum/Desktop/dev/scratch"
};

init(config);

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

createState(
  "Foobar",
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
  "User",
  {
    id: {
      type: "string",
      default: ""
    },
    name: {
      type: "string",
      default: "john doe"
    },
    age: {
      type: "number",
      default: 0
    }
  },
  config
);

addAction("Baz", "TEST_ACTION", config);

addAction("Baz", "second_action", config);
