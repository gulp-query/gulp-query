let Plugin = require('../../src/Plugin')
  , node_path = require('path')
  , sass = require('gulp-sass')
  , gulp = require('gulp')
  , gulpif = require('gulp-if')
  , rename = require('gulp-rename')
  , cssnano = require("gulp-cssnano")
  , sourcemaps = require('gulp-sourcemaps')
  , spritus = require('gulp-css-spritus')
  , assetus = require('gulp-css-assetus')
  , imageminPngquant = require('imagemin-pngquant')
  , imageminMozjpeg = require('imagemin-mozjpeg')
;

class ScssImagesPlugin extends Plugin {

  static method() {
    return 'scss';
  }

  run(task_name, config, callback) {

    let full = ('full' in config ? config['full'] : false);
    let path_to = this.path(config.to);
    let path_from = this.path(config.from);
    let includePaths = 'includePaths' in config ? config['includePaths'] : [];
    let imageDirCSS = 'image_dir_css' in config ? config['image_dir_css'] : '../images/';
    let imageDirSave = this.path('image_dir_save' in config ? config['image_dir_save'] : 'images/');

    let sourceMap = ('source_map' in config ? config['source_map'] : true);
    let sourceMapType = ('source_map_type' in config ? config['source_map_type'] : 'inline');
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    if (this.isProduction()) {
      sourceMap = false;
    }

    let imageminCfg = {
      png: {
        quality: '60-70',
        speed: 1
      },
      jpeg: {
        quality: 60,
        //targa: true
      }
    };

    ['png', 'jpg'].forEach((c) => {
      if (!(c in config)) return;

      let _ci;
      for (_ci in imageminCfg[c]) {
        if (!imageminCfg[c].hasOwnProperty(_ci)) continue;

        if (_ci in config[c]) {
          imageminCfg[c][_ci] = config[c][_ci]
        }
      }
    });

    let filename_from = node_path.basename(path_from);
    path_from = node_path.dirname(path_from) + '/';

    let filename_to;

    if (node_path.extname(path_to) !== '') {
      filename_to = node_path.basename(path_to);
      path_to = node_path.dirname(path_to) + '/';
    } else {
      let basename = node_path.basename(filename_from, '.scss');
      filename_to = basename === '*' ? '' : basename + '.css';
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
      .pipe(this.plumber(this.reportError.bind(this, task_name, _src, _dest)))
      .pipe(gulpif(sourceMap, sourcemaps.init()))
      .pipe(sass({
        outputStyle: 'expanded',
        includePaths: includePaths
      }).on('error', sass.logError))
      .pipe(spritus({
        imageDirCSS: imageDirCSS,
        imageDirSave: imageDirSave,
        withImageminPlugins: [
          imageminMozjpeg(imageminCfg.jpeg),
          imageminPngquant(imageminCfg.png)
        ]
      }))
      .pipe(assetus({
        imageDirCSS: imageDirCSS,
        imageDirSave: imageDirSave,
        withImageminPlugins: [
          imageminMozjpeg(imageminCfg.jpeg),
          imageminPngquant(imageminCfg.png)
        ]
      }))
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
      .pipe(gulpif(!!filename_to, rename(filename_to)))
      .pipe(gulp.dest(path_to))
      .pipe(this.notify(this.report.bind(this, task_name, _src, _dest, true, list)))
      ;

  }
}

module.exports = ScssImagesPlugin;