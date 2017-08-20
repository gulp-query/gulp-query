let Plugin = require('../../src/Plugin')
  , spritesmith = require('gulp.spritesmith')
  , glob = require('glob')
  , imagemin = require('gulp-imagemin')
  , gulp = require('gulp')
  , imageminPngquant = require('imagemin-pngquant')
  , imageminMozjpeg = require('imagemin-mozjpeg')
  , buffer = require('vinyl-buffer')
  , node_path = require('path')
;

class SpritePlugin extends Plugin {

  static method() {
    return 'sprite';
  }

  /**
   *
   * @param {GulpQuery} GulpQuery
   * @param configs
   */
  constructor(GulpQuery, configs) {
    super(GulpQuery, configs);

    this._reportOfSprites = {};
  }

  watchFiles(config) {

    return [];
  }

  run(task_name, config, callback) {

    let path_to_images = this.path(config.to.images);
    let path_to_css = this.path(config.to.css);
    let from = config['from'];
    //let name = 'name' in config ? config['name'] : null;
    let parent_folder = 'parent_folder' in config ? config.parent_folder : null;

    if (!Array.isArray(from)) {
      from = [from];
    }

    let arrPathToImages = path_to_images.split('/');
    let arrPathToCss = path_to_css.split('/');

    let same = [];
    let diff = [];
    let toImages;
    let toCss;
    for (let i = 0, l = arrPathToCss.length; i < l; ++i) {
      if (diff.length === 0 && arrPathToCss[i] === arrPathToImages[i]) {
        same.push(arrPathToCss[i]);
      } else {
        toImages = arrPathToImages.slice(i).join('/');
        toCss = arrPathToCss.slice(i).join('/');
        path_to_images = arrPathToImages.slice(0, i).join('/');
        path_to_css = arrPathToCss.slice(0, i).join('/');
        break;
      }
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

    ['png', 'jpg'].forEach(function(c) {
      if (!(c in config)) return;

      let _ci;
      for (_ci in imageminCfg[c]) {
        if (!imageminCfg[c].hasOwnProperty(_ci)) continue;

        if (_ci in config[c]) {
          imageminCfg[c][_ci] = config[c][_ci]
        }
      }
    });

    let padding = 'padding' in config ? config.padding : 1;
    let algorithm = 'algorithm' in config ? config.algorithm : 'binary-tree';

    let cssFormat = false;
    let cssExtension = 'css';
      // json_texture json json_array css scss sass less
    if (('format' in config)) {
      cssFormat = config.format;
    }
    if (('extension' in config)) {
      cssExtension = config.extension;
    }

    let _src, _destImage, _destCSS, _extImage, name;
    let spriteData;
    let _cfg;

    let stream = [];

    from.forEach((sprite) => {

      if (typeof sprite === 'object') {
        _src = sprite.from;
        name = sprite.to;
      } else {
        _src = sprite;
        let nameArr = node_path.dirname(sprite).split('/');
        name = nameArr[nameArr.length - 1];
      }

      _extImage = node_path.extname(name);

      if (_extImage === '') {
        _extImage = node_path.extname(_src);
      }

      _destImage = path_to_images + '/' + toImages + name + _extImage;
      _destCSS = path_to_css + '/' + toCss + name + '.' + cssExtension;

      _cfg = {
        imgName: toImages + name + _extImage,
        cssName: toCss + name + '.' + cssExtension,
        algorithm: algorithm,
        padding: padding
      };

      if (cssFormat) {
        _cfg['cssFormat'] = cssFormat;
      }

      spriteData = gulp.src(_src)
        .pipe(spritesmith(_cfg));

      stream.push(spriteData.img
        .pipe(buffer())
        .pipe(imagemin(
          [
            imageminMozjpeg(imageminCfg.jpeg),
            imageminPngquant(imageminCfg.png)
          ]
        ))
        .pipe(gulp.dest(path_to_images))
        .pipe(this.notify(this.reportOfSprite.bind(this, task_name, 'img', _src, _destImage)))
      )
      ;

      stream.push(spriteData.css
        .pipe(gulp.dest(path_to_css))
        .pipe(this.notify(this.reportOfSprite.bind(this, task_name, 'css', _src, _destCSS)))
      )
      ;
    });

    return stream;
  }

  reportOfSprite(task_name, type, src, dest) {

    if (!(src in this._reportOfSprites)) {
      this._reportOfSprites[src] = {
        css: null,
        img: null
      };
    }

    this._reportOfSprites[src][type] = dest;

    if (this._reportOfSprites[src].css && this._reportOfSprites[src].img) {
      this.report(task_name, src, [
        this._reportOfSprites[src].img,
        this._reportOfSprites[src].css
      ], true);

      delete this._reportOfSprites[src];
    }
  }
}

module.exports = SpritePlugin;