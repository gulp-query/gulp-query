let Plugin = require('../../src/Plugin')
  , node_path = require('path')
  , glob = require('glob')
  , buble = require('gulp-buble')
  , uglify = require('gulp-uglify')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , concat = require("gulp-concat")
  , sourcemaps = require('gulp-sourcemaps')
;

class JsBublePlugin extends Plugin {

  static method() {
    return 'js';
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

    let full = ('full' in config ? config['full'] : false);
    let path_to = this.path(config.to);
    let parent_folder = 'parent_folder' in config ? config.parent_folder : null;

    let concat_name, copy_to;
    if (!node_path.extname(path_to)) {
      concat_name = null;
      copy_to = path_to;
    } else {
      concat_name = node_path.basename(path_to);
      copy_to = node_path.dirname(path_to) + '/'
    }

    if (!Array.isArray(config.from)) {
      config.from = [config.from];
    }

    let from = [];
    config.from.forEach((path) => {

      path = this.path(parent_folder ? (parent_folder + path) : path);

      if (node_path.basename(path).indexOf('*') !== -1) {
        glob.sync(path).forEach((f) => {
          from.push(f);
        });
      } else {
        from.push(path);
      }

    });

    let sourceMap = ('source_map' in config ? config['source_map'] : true);
    let sourceMapType = ('source_map_type' in config ? config['source_map_type'] : 'inline');
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    if (this.isProduction()) {
      sourceMap = false;
    }

    let list = [];

    if (concat_name) {
      list.push('Concat');
    }

    if (this.isProduction() && !full) {
      list.push('Compress');
    }

    if (sourceMap) {
      if (sourceMapType === 'source-map') {
        list.push('Source map: file');
      } else {
        list.push('Source map: inline');
      }
    }

    let _src = from;
    let _dest = copy_to + (concat_name ? concat_name : '');
    let reportFunc;

    if (!concat_name) {
      this._reportList[_src] = {
        from: _src,
        to: _dest,
        completeAmount: 0
      };

      reportFunc = this.reportList.bind(this, task_name, _src);
    } else {
      reportFunc = this.report.bind(this, task_name, _src, _dest, true, list);
    }

    return gulp.src(_src)
      .pipe(this.plumber(this.reportError.bind(this, task_name, _src, _dest)))
      .pipe(gulpif(sourceMap, sourcemaps.init()))
      .pipe(buble())
      .pipe(gulpif(!!concat_name, concat(concat_name || 'empty')))
      .pipe(gulpif(!full && this.isProduction(), uglify()))
      .pipe(gulpif(sourceMap, sourcemaps.write(
        (sourceMapType === 'inline-source-map' ? null : '.'),
        {includeContent: (sourceMapType === 'inline-source-map')}
      )))
      .pipe(gulp.dest(copy_to))
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

module.exports = JsBublePlugin;