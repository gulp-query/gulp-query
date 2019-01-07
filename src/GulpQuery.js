const gulp = require('gulp');
const chalk = require('chalk');
const gulpPlumber = require('gulp-plumber');
const gulpNotify = require('gulp-notify');
const ThrowError = require('./ThrowError');
const report = require('./Report');

class GulpQuery {

  constructor(args) {
    this._args = args;
    this._params = args._.slice(0);

    this.config = {
      root: process.cwd() + '/'
    };

    this._plugins = {};
    this._pluginsConfig = {};

    this.report = report(this.config.root);

    this.plumber = gulpPlumber;
    this.notify = gulpNotify;

    this._isProduction = 'production' in this._args;

    this._isWatching = false;

    /**
     * @type {Array<Plugin>}
     * @private
     */
    this._watchPlugins = [];

    this._proxy = new Proxy(this, {
      get: (gq, field) => {
        if (field in gq) return gq[field]; // normal case

        return (...args) => {
          return this._prepare(field, args);
        };
      }
    });

    return this._proxy;
  }

  plugins(...plugins) {

    if (Array.isArray(plugins[0])) {
      plugins = plugins[0];
    }

    plugins.forEach((plugin) => {
      this._plugins[plugin.method()] = plugin;
    });

    return this._proxy;
  }

  isProduction() {
    return this._isProduction;
  }

  isWatching() {
    return this._isWatching;
  }

  _prepareCheckParams(pluginName) {
    if (this._params.length === 0 || (this._params.length === 1 && this._params.indexOf('watch') !== -1)) {
      return true;
    }

    let find = false;

    this._params.forEach((param) => {
      if (param === 'watch') {
        return;
      }

      if (param.indexOf(pluginName) !== -1) {
        find = true;
      }
    });

    return find;
  }

  _prepare(pluginName, args) {
    if (!(pluginName in this._plugins)) {
      //console.log(args);
      ThrowError.make('There are no plugin for method «' + pluginName + '»');
    }

    if (!this._prepareCheckParams(pluginName)) {
      return this._proxy;
    }

    if (!args[0]) {
      ThrowError.make('You have to set config for method «' + pluginName + '»');
    }

    if (!(pluginName in this._pluginsConfig)) {
      this._pluginsConfig[pluginName] = [];
    }

    this._pluginsConfig[pluginName].push(args);

    return this._proxy;
  }

  run() {
    if (this.isProduction()) {
      console.log(chalk.white.bgGreen.bold(' >>> PRODUCTION <<< '));
    }

    let pluginsNeedRun = [];
    let params = [...this._params];

    if (params.indexOf('watch') !== -1) {
      params.splice(params.indexOf('watch'), 1);

      this._isWatching = true;
    }

    if (params.length === 0) {
      pluginsNeedRun = Object.keys(this._pluginsConfig);
    } else {

      params.forEach((param) => {
        if (param.indexOf(':') !== -1) {
          param = param.split(":")[0];
        }

        if (param in this._plugins) {

          if (pluginsNeedRun.indexOf(param) === -1) {
            pluginsNeedRun.push(param);
          }

        } else {
          ThrowError.make('There are no plugin for param «' + param + '»');
        }
      });

    }

    let DefaultTasks = [];
    pluginsNeedRun.forEach((plugin) => {

      let pluginModule = new this._plugins[plugin](this, this._pluginsConfig[plugin]);

      let tasks = pluginModule.getAllTasks()
        .filter((task) => {
          return params.length === 0 || params.indexOf(plugin) !== -1 || params.indexOf(task) !== -1;
        });

      tasks.forEach((task) => {
        gulp.task(task, pluginModule.runTask.bind(pluginModule, task));
      });

      this._watchPlugins.push(pluginModule);

      gulp.task(plugin, gulp.series(tasks));

      //if (plugin === 'webpack' && this._isWatching) return;

      DefaultTasks.push(plugin);
    });

    if (DefaultTasks.length) {
      gulp.task('default', gulp.series(DefaultTasks));
    }

    if (this._isWatching) {

      if (DefaultTasks.length) {
        gulp.task('watch', gulp.series('default', this.watch.bind(this)));
      } else {
        gulp.task('watch', this.watch.bind(this));
      }

    } else {
      process.on('beforeExit', () => {
        this.report.draw();
      });
    }

  }

  watch(callback) {

    let params = [...this._params];
    if (params.indexOf('watch') !== -1) {
      params.splice(params.indexOf('watch'), 1);
    }

    this._watchPlugins.forEach((pluginModule) => {

      let plugin = pluginModule.constructor.method();

      let tasks = pluginModule.getAllTasks()
        .filter((task) => {
          return params.length === 0 || params.indexOf(plugin) !== -1 || params.indexOf(task) !== -1;
        });

      tasks.forEach((task) => {
        let files = pluginModule.watchTaskFiles(task);

        files.forEach((file) => {
          gulp.watch(file, gulp.series([task]));
        })
      });
    });

    callback();

  }
}

module.exports = GulpQuery;