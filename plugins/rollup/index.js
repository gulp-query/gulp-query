let Plugin = require('../../src/Plugin')
  , node_path = require('path')
  , file = require('gulp-file')
  , gulp = require('gulp')
  , rollup = require('rollup').rollup
  , buble = require('rollup-plugin-buble')
  , nodeResolve = require('rollup-plugin-node-resolve')
  , commonjs = require('rollup-plugin-commonjs')
  , uglify = require('rollup-plugin-uglify')
  , minify  = require('uglify-es').minify

;

let cache;

class RollupPlugin extends Plugin {

  static method() {
    return 'rollup';
  }

  run(task_name, config, callback) {

    let name = ('name' in config ? config['name'] : false);
    let moduleName = ('moduleName' in config ? config['moduleName'] : false);
    let full = ('full' in config ? config['full'] : false);
    let path_to = this.path(config.to);
    let path_from = this.path(config.from);

    let sourceMap = ('source_map' in config ? config['source_map'] : true);
    if (this.isProduction()) {
      sourceMap = false;
    }

    let filename_from = node_path.basename(path_from);
    path_from = node_path.dirname(path_from) + '/';

    let filename_to;

    if (node_path.extname(path_to) !== '') {
      filename_to = node_path.basename(path_to);
      path_to = node_path.dirname(path_to) + '/';
    } else {
      filename_to = node_path.basename(filename_from);
    }

    let list = [];

    if (sourceMap) {
      list.push('Source map');
    }

    if (this.isProduction() && !full) {
      list.push('Compress');
    }

    let _src = path_from + filename_from;
    let _dest = path_to + filename_to;

    if (!moduleName) {
      if (name) {
        moduleName = name;
      } else {
        moduleName = node_path.basename(filename_to, '.js');
        moduleName = moduleName[0].toUpperCase() + moduleName.slice(1);
      }
    }

    return rollup({
      input: _src,
      plugins: [
        nodeResolve({browser: true, main: true, jsnext: true}),
        // commonjs({
        //   include: [
        //     'node_modules/**',
        //     path_from + '**'
        //   ]
        // }),
        buble()
        , this.isProduction() && uglify({}, minify)
      ],
      cache: cache
    })
      .then((bundle) => {
        cache = bundle;
        return bundle.generate({
          format: 'iife',
          sourcemap: sourceMap,
          name: moduleName
        });
      })
      .then((result) => {
        return file(filename_to, result.code, {src: true})
          .pipe(gulp.dest(path_to))
          .pipe(this.notify(this.report.bind(this, task_name, _src, _dest, true, list)))
      })
      ;

  }
}

module.exports = RollupPlugin;