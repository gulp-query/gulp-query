let Plugin = require('../../src/Plugin')
  , node_path = require('path')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , concat = require("gulp-concat")
  , cssnano = require("gulp-cssnano")
  , sourcemaps = require('gulp-sourcemaps')
;

class StylesPlugin extends Plugin {

  static method() {
    return 'styles';
  }

  run(task_name, config, callback) {

    let full = ('full' in config ? config['full'] : false);
    let path_to = this.path(config.to);
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

    let sourceMap = ('source_map' in config ? config['source_map'] : true);
    let sourceMapType = ('source_map_type' in config ? config['source_map_type'] : 'inline');
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    if (this.isProduction()) {
      sourceMap = false;
    }


    let concat_name, copy_to;

    if (node_path.extname(path_to) === '') {
      concat_name = null;
      copy_to = path_to;
    } else {
      concat_name = node_path.basename(path_to);
      copy_to = node_path.dirname(path_to) + '/'
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

    return gulp.src(from)
            .pipe(this.plumber(this.reportError.bind(this,task_name,_src, _dest)))
            .pipe(gulpif(sourceMap, sourcemaps.init()))
            .pipe(gulpif(!!concat_name, concat(concat_name || 'empty')))
            .pipe(gulpif(
                !full && this.isProduction(),
                cssnano({
                    autoprefixer: {
                        browsers: ["> 1%", "last 2 versions"],
                        add: true
                    }
                })
            ))
            .pipe(gulpif(sourceMap, sourcemaps.write(
                (sourceMapType === 'inline-source-map' ? null : '.'),
                {includeContent: (sourceMapType === 'inline-source-map')}
            )))
            .pipe(gulp.dest(copy_to))
            .pipe(this.notify(this.report.bind(this,task_name, _src, _dest, true, list)))
            ;

  }
}

module.exports = StylesPlugin;