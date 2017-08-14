const ThrowError = require('./ThrowError');
let merge = require('merge-stream');

class Plugin {

  /**
   *
   * @param {GulpQuery} GulpQuery
   * @param configs
   */
  constructor(GulpQuery, configs) {
    /**
     * @type {GulpQuery}
     * @private
     */
    this._GulpQuery = GulpQuery;

    this._initialConfigs = configs;

    this._taskToConfig = {};

    this._initConfigs();
  }

  static method() {
    return 'default';
  }

  isProduction() {
    return this._GulpQuery.isProduction();
  }

  plumber(d) {
    return this._GulpQuery.plumber(d);
  }

  notify(d) {
    return this._GulpQuery.notify(d);
  }

  _initConfigs() {
    let i = 1;
    this._initialConfigs.forEach((config) => {

      if (config.length > 1) {
        let new_config = {
          from: config[0],
          to: config[1],
        };

        if (config[2]) {
          console.log(config[2]);
          if (typeof config[2] === 'object') {
            new_config = Object.assign({},new_config,config[2]);
          } else {
            new_config.name = config[2];
          }
        }

        config = new_config;
      } else {
        config = config[0];
      }

      let taskName = this.constructor.method() + ':' + (config.name ? config.name : ('task-' + i));

      this._taskToConfig[taskName] = config;

      ++i;
    });
  }

  path(path) {
    return this._GulpQuery.config.root + path;
  }

  getAllTasks() {
    return Object.keys(this._taskToConfig);
  }

  runTask(task_name, callback) {

    if (!(task_name in this._taskToConfig)) {
      ThrowError.make('Not found config for a task «' + task_name + '»');
    }

    let config = this._taskToConfig[task_name];

    try {
      let _p = this.run(config, callback);

      if (Array.isArray(_p)) {
        return merge.apply(null, _p);
      } else {
        return _p;
      }
    }
    catch (e) {
      //ThrowError.make('ERROR: ' + task_name + '');
      console.error(config);
      console.error(e);
    }
  }

  report(src, dest, success, list) {
    this._GulpQuery.report.add(this.constructor.method(), src, dest, success, list);
  }

  reportError(src, dest, error) {
    console.log(error.toString());
    this.report(src, dest, false);
  }

  reportAlias(alias, src, dest, success, list) {
    this._GulpQuery.report.add(this.constructor.method() + '-' + alias, src, dest, success, list);
  }

  run(config) {

  }
}

module.exports = Plugin;