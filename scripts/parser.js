/* @flow */
const babylon = require("babylon");

export default (input: string) =>
  babylon.parse(input, {
    sourceType: "module",
    plugins: ["flow"]
  });
