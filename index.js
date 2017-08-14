let GulpQuery = require('./src/GulpQuery');

function make() {
  return new GulpQuery(require('minimist')(process.argv.slice(2)));
}
//make().cfg({a:1}).sass('asd','s').copy('1');

module.exports = function(callback) {
  if (typeof callback === "undefined") {
    return make();
  }

  let t = make();
  callback.call(null, t);
  t.run();
};