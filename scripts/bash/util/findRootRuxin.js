var fs = require("fs");
var path = require("path");

var ruxinFileName = ".ruxin";

module.exports = pwd => {
  let dir = pwd;

  while (
    dir !== process.env.HOME &&
    dir !== process.env.HOMEPATH &&
    dir !== process.env.USERPROFILE
  ) {
    if (fs.existsSync(`${dir}/${ruxinFileName}`)) {
      return dir;
    }

    dir = path.resolve(dir, "../");
  }

  throw new Error(
    'Cannot find root of Ruxin project! Did you delete your ".ruxin" file?'
  );
};
