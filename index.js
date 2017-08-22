let GulpQuery = require('./src/GulpQuery');

function make() {
  return new GulpQuery(require('minimist')(process.argv.slice(2)));
}

module.exports = function(callback) {
  if (typeof callback === "undefined") {
    return make();
  }

  let t = make();
  callback.call(null, t);
  t.run();
};

module.exports.Plugin = require('./src/Plugin');