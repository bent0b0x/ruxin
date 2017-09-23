var prompt = require("prompt");

var getProps = (state, props = {}, dir, cb) => {
  prompt.start();
  prompt.message = "";
  prompt.get(
    {
      name: "key",
      required: false,
      message: "key (leave blank to finish)"
    },
    function(err, { key }) {
      if (key) {
        prompt.get(
          {
            name: "type",
            required: true
          },
          function(err, { type }) {
            prompt.get(
              {
                name: "default",
                required: true
              },
              function(err, result) {
                props[key] = {
                  type: type,
                  default: result.default
                };
                getProps(state, props, dir, cb);
              }
            );
          }
        );
      } else {
        cb(state, props, dir);
      }
    }
  );
};

module.exports = getProps;
