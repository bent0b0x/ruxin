var api = require("../../../build/bundle");
var findRootRuxin = require("./findRootRuxin");

module.exports = (containerName, state = "", options) => {
  var baseDir = findRootRuxin(process.cwd());

  state = state ? state : options.state ? containerName : "";

  var firstDelimeterIndex = state.indexOf(".");
  var stateToUse =
    firstDelimeterIndex === -1 ? state : state.slice(firstDelimeterIndex + 1);

  api.container.create(
    containerName,
    stateToUse,
    firstDelimeterIndex === -1 ? "" : state.slice(0, firstDelimeterIndex),
    {
      baseDir
    }
  );
};
