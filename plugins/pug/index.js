let Plugin = require('../../src/Plugin')
  , node_path = require('path')
  , glob = require('glob')
  , gulp = require('gulp')
  , pug = require("gulp-pug")
;

class PugPlugin extends Plugin {

  static method() {
    return 'pug';
  }

  /**
   *
   * @param {GulpQuery} GulpQuery
   * @param configs
   */
  constructor(GulpQuery, configs) {
    super(GulpQuery, configs);

    /**
     * @type {Object.<String,{from: Array, to: String, completeAmount: Number}>}
     * @private
     */
    this._reportList = {};
  }

  run(task_name, config, callback) {
    let path_to = this.path(config.to);
    let parent_folder = 'parent_folder' in config ? config.parent_folder : null;

    if (!Array.isArray(config.from)) {
      config.from = [config.from];
    }

    let from = [];
    config.from.forEach((path) => {

      path = this.path(parent_folder ? (parent_folder + path) : path);

      if (node_path.basename(path).indexOf('*') !== -1) {
        glob.sync(path).forEach((f) => {
          if (node_path.basename(f).indexOf('_') !== 0) {
            from.push(f);
          }
        });
      } else {
        from.push(path);
      }

    });

    let _src = from;
    let _dest = path_to;
    let reportFunc;

    this._reportList[_src] = {
      from: _src,
      to: _dest,
      completeAmount: 0
    };

    reportFunc = this.reportList.bind(this, task_name, _src);

    return gulp.src(_src)
      .pipe(this.plumber(this.reportError.bind(this, task_name, _src, _dest)))
      .pipe(pug({
        pretty: !this.isProduction()
      }))
      .pipe(gulp.dest(_dest))
      .pipe(this.notify(reportFunc))
      ;
  }

  reportList(task_name, from) {

    if (!(from in this._reportList)) {
      return;
    }

    ++this._reportList[from].completeAmount;

    if (this._reportList[from].completeAmount >= this._reportList[from].from.length) {
      this.report(
        task_name,
        this._reportList[from].from,
        this._reportList[from].to,
        true
      );

      delete this._reportList[from];
    }
  }
}

module.exports = PugPlugin;