let Plugin = require('../../src/Plugin')
  , glob = require('glob')
  , imagemin = require('gulp-imagemin')
  , gulp = require('gulp')
  , imageminPngquant = require('imagemin-pngquant')
  , imageminMozjpeg = require('imagemin-mozjpeg')
;

class CompressPlugin extends Plugin {

  static method() {
    return 'compress';
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
    this._reportsOfCompress = {};
  }

  watchFiles(config) {

    return [];
  }

  run(task_name, config, callback) {

    let from = config['from'];
    let path_to = this.path(config.to);
    let name = 'name' in config ? config['name'] : null;
    let parent_folder = 'parent_folder' in config ? config.parent_folder : null;

    if (!Array.isArray(from)) {
      from = [from];
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

    let stream = [];
    let to, imagesList;
    from.forEach((f) => {

      if (typeof f === 'object') {
        from = this.path(parent_folder ? (parent_folder + f.from) : f.from);
        to = path_to + f.to;
      } else {
        from = this.path(parent_folder ? (parent_folder + f) : f);
        to = path_to;
      }

      imagesList = glob.sync(from);

      this._reportsOfCompress[from] = {
        from: imagesList,
        to: to,
        completeAmount: 0
      };

      stream.push(gulp.src(from)
        .pipe(imagemin([
          imageminMozjpeg(imageminCfg.jpeg),
          imageminPngquant(imageminCfg.png)
        ]))
        .pipe(gulp.dest(to))
        .pipe(this.notify(this.reportOfCompress.bind(this, task_name, from))));

    });

    return stream;

  }

  reportOfCompress(task_name, from) {

    if (!(from in this._reportsOfCompress)) {
      return;
    }

    ++this._reportsOfCompress[from].completeAmount;

    if (this._reportsOfCompress[from].completeAmount >= this._reportsOfCompress[from].from.length) {
      this.report(
        task_name,
        this._reportsOfCompress[from].from,
        this._reportsOfCompress[from].to,
        true
      );

      delete this._reportsOfCompress[from];
    }
  }
}

module.exports = CompressPlugin;