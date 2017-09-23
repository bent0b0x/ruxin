var api = require("../../../build/bundle");
var findRootRuxin = require("./findRootRuxin");

module.exports = (componentName, state = "", options) => {
  var baseDir = findRootRuxin(process.cwd());

  state = state ? state : options.state ? componentName : "";

  var firstDelimeterIndex = state.indexOf(".");
  var stateToUse =
    firstDelimeterIndex === -1 ? state : state.slice(firstDelimeterIndex + 1);

  api.component.create(
    componentName,
    stateToUse,
    firstDelimeterIndex === -1 ? "" : state.slice(0, firstDelimeterIndex),
    {
      baseDir
    }
  );
};
