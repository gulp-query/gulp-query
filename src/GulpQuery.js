const chalk = require('chalk');
const gulp = require('gulp');

class GulpQuery {

  constructor(args) {
    this._args = args;
    this._params = args._.slice(0);

    this._config = {
      root: process.cwd() + '/'
    };

    this._plugins = {};
    this._pluginsConfig = {};

    this._isWatching = false;

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

  plugins(plugins)
  {
    plugins.forEach((plugin) => {
      this._plugins[plugin.method] = plugin;
    });

    return this._proxy;
  }

  cfg()
  {
    console.log('CFG!!');

    return this._proxy;
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
      console.log(args);
      console.log(chalk.red('There are no plugin for method «' + pluginName + '»'));
      process.exit()
    }

    if (!this._prepareCheckParams(pluginName)) {
        return this._proxy;
    }

    if (!args[0]) {
      console.log(chalk.red('You have to set config for method «' + pluginName + '»'));
      process.exit()
    }

    if (!(pluginName in this._pluginsConfig)) {
      this._pluginsConfig[pluginName] = [];
    }

    this._pluginsConfig[pluginName].push(args);

    return this._proxy;
  }

  run()
  {

    if (this._params.indexOf('watch') !== -1) {
      gulp.task('watch', this.watch.bind(this));
      this._isWatching = true;
    }

    let pluginsNeedRun = [];
    let params = [...this._params];

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
          console.log(chalk.red('There are no plugin for param «' + param + '»'));
          process.exit()
        }
      });

    }

    pluginsNeedRun.forEach((plugin) => {
      let pluginModule = this._plugins[plugin](this, this._pluginsConfig[plugin]);

      let tasks = pluginModule.getAllTasks();
      tasks.forEach((task) => {
        gulp.task(task, pluginModule.runTask.bind(pluginModule, task));
      });

      gulp.task(plugin, tasks);
    });

  }

}

module.exports = GulpQuery;