let Plugin = require('../../src/Plugin')
  , node_path = require('path')
  , gulp = require('gulp')
  , concat = require("gulp-concat")
;

class CopyPlugin extends Plugin {

  static method() {
    return 'copy';
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
    this._reportsOfCopy = {};
  }

  watchFiles(config) {

    return [];
  }

  run(task_name, config, callback) {

    let from = config['from'];
    let path_to = this.path(config.to);
    let name = 'name' in config ? config['name'] : null;
    let is_concat = 'concat' in config ? config['concat'] : false;

    if (node_path.extname(path_to) !== '') {
      is_concat = true;
    }

    let list = [];

    if (!Array.isArray(from)) {
      from = [from];
    }

    let prepareFrom = [];
    from.forEach((f) => {
      prepareFrom.push(this.path(f));
    });

    if (!is_concat) {

      this._reportsOfCopy[path_to] = {
        from: from,
        to: path_to,
        completeAmount: 0
      };

      return gulp.src(prepareFrom)
        .pipe(gulp.dest(path_to))
        .pipe(this.notify(this.reportOfCopy.bind(this, task_name, path_to)))
        ;

    } else {

      if (from.length > 1) {
        list.push('Concat');
      } else {
        list.push('Rename');
      }

      let concat_name, copy_to;

      if (node_path.extname(path_to) === '') {
        concat_name = name + node_path.extname(from[0]);
        copy_to = path_to;
      } else {
        concat_name = node_path.basename(path_to);
        copy_to = node_path.dirname(path_to) + '/'
      }

      return gulp.src(prepareFrom)
        .pipe(concat(concat_name))
        .pipe(gulp.dest(copy_to))
        .pipe(this.notify(this.report.bind(this, task_name, prepareFrom, copy_to + concat_name, true, list)))
        ;

    }
  }

  reportOfCopy(task_name, pathTo) {

    if (!(pathTo in this._reportsOfCopy)) {
      return;
    }

    ++this._reportsOfCopy[pathTo].completeAmount;

    if (this._reportsOfCopy[pathTo].completeAmount >= this._reportsOfCopy[pathTo].from.length) {
      this.report(
        task_name,
        this._reportsOfCopy[pathTo].from,
        this._reportsOfCopy[pathTo].to,
        true
      );

      delete this._reportsOfCopy[pathTo];
    }
  }
}

module.exports = CopyPlugin;