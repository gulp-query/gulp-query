let Plugin = require('./Plugin')
  , node_path = require('path')
  , sass = require('gulp-sass')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , rename = require('gulp-rename')
  , sourcemaps = require('gulp-sourcemaps')
;

class ScssPlugin extends Plugin {

  static method() {
    return 'scss';
  }

  run(config, callback) {
    let full = ('full' in config ? config['full'] : false);
    let path_to = this.path(config.to);
    let path_from = this.path(config.from);
    let includePaths = 'includePaths' in config ? config['includePaths'] : [];

    let sourceMap = ('source_map' in config ? config['source_map'] : false);
    let sourceMapType = ('source_map_type' in config ? config['source_map_type'] : 'inline');
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    if (this.isProduction()) {
      sourceMap = false;
    }

    let filename_from = node_path.basename(path_from);
    path_from = node_path.dirname(path_from) + '/';

    let filename_to = filename_from;
    if (node_path.extname(path_to) !== '') {
      filename_to = node_path.basename(path_to);
      path_to = node_path.dirname(path_to) + '/';
    } else {
      filename_to = node_path.basename(filename_to, '.scss') + '.css';
    }

    let list = [];

    if (sourceMap) {
      if (sourceMapType === 'source-map') {
        list.push('Source map: file');
      } else {
        list.push('Source map: inline');
      }
    }

    if (this.isProduction() && !full) {
      list.push('Compress');
    }

    includePaths = includePaths.map((name) => {
      return this.path(name);
    });

    let _src = path_from + filename_from;
    let _dest = path_to + filename_to;

    return gulp.src(_src)
      .pipe(this.plumber(this.reportError.bind(this, _src, _dest)))
      .pipe(gulpif(sourceMap, sourcemaps.init()))
      .pipe(sass({
        //outputStyle: (CocktailOfTasks.isProduction && !full ? 'compressed' : 'expanded'),
        outputStyle: 'expanded',
        includePaths: includePaths
      }).on('error', sass.logError))
      .pipe(gulpif(sourceMap, sourcemaps.write(
        (sourceMapType === 'inline-source-map' ? null : '.'),
        {includeContent: (sourceMapType === 'inline-source-map')}
      )))
      .pipe(rename(filename_to))
      .pipe(gulp.dest(path_to))
      .pipe(this.notify(this.report.bind(this, _src, _dest, true, list)))
      ;

  }
}

module.exports = ScssPlugin;