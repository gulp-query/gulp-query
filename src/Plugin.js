const ThrowError = require('./ThrowError');
let merge = require('merge-stream')
  , node_path = require('path')
;

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

  _prepareConfig(config) {
    if (config.length > 1) {
      let new_config = {
        from: config[0],
        to: config[1],
      };

      if (config[2]) {

        if (typeof config[2] === 'object') {
          new_config = Object.assign({}, new_config, config[2]);
        } else {
          new_config.name = config[2];
        }
      }

      config = new_config;
    } else {
      config = config[0];
    }

    return config;
  }

  _initConfigs() {
    let i = 1;
    this._initialConfigs.forEach((config) => {

      config = this._prepareConfig(config);

      let taskName = this.constructor.method() + ':' + (config.name ? config.name : ('task-' + i));

      this._taskToConfig[taskName] = config;

      ++i;
    });
  }

  path(path) {
    return this._GulpQuery.config.root + path;
  }

  /**
   * @returns {Array}
   */
  getAllTasks() {
    return Object.keys(this._taskToConfig);
  }

  /**
   * @param task_name
   * @returns {Array}
   */
  watchTaskFiles(task_name) {
    if (!(task_name in this._taskToConfig)) {
      ThrowError.make('Not found config for a task «' + task_name + '»');
    }

    return this.watchFiles(this._taskToConfig[task_name])
  }

  runTask(task_name, callback) {

    if (!(task_name in this._taskToConfig)) {
      ThrowError.make('Not found config for a task «' + task_name + '»');
    }

    let config = this._taskToConfig[task_name];

    try {
      let _p = this.run(task_name, config, callback);

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

  report(task_name, src, dest, success, list) {
    this._GulpQuery.report.add(
      (task_name ? task_name : this.constructor.method()),
      src,
      dest,
      success,
      list
    );

    if (this._GulpQuery.isWatching()) {
      setTimeout(() => {
        this._GulpQuery.report.draw();
      }, 10);
    }
  }

  reportError(task_name, src, dest, error) {
    console.log(error.toString());
    this.report(task_name, src, dest, false);
  }

  reportAlias(alias, src, dest, success, list) {
    this._GulpQuery.report.add(this.constructor.method() + '-' + alias, src, dest, success, list);

    if (this._GulpQuery.isWatching()) {
      setTimeout(() => {
        this._GulpQuery.report.draw();
      }, 10);
    }
  }

  run(task_name, config, callback) {

  }

  /**
   * @param config
   * @return {Array}
   */
  watchFiles(config) {
    let parent_folder = 'parent_folder' in config ? config.parent_folder : null;
    if (!Array.isArray(config.from)) {
      config.from = [config.from];
    }

    let from = [];
    config.from.forEach((path) => {
      from.push(
        this.path(parent_folder ? (parent_folder + path) : path)
      );
    });

    let ext = node_path.extname(config.from[0]);
    let files = [];

    from.forEach((path_from) => {
      files.push(node_path.dirname(path_from) + '/' + node_path.basename(path_from, ext) + '/**/*' + ext);
      files.push(path_from);
    });

    return files;
  }
}

module.exports = Plugin;