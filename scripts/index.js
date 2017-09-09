import createState from "scripts/state/create";

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
  {
    baseDir: "/Users/bbaum/Desktop/dev/scratch",
    stateDir: "/state"
  }
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
  {
    baseDir: "/Users/bbaum/Desktop/dev/scratch",
    stateDir: "/state"
  },
  "Baz"
);
