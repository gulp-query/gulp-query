let Plugin = require('../../src/Plugin')
  , node_path = require('path')
  , webpack = require("webpack")
;

class WebpackPlugin extends Plugin {

  static method() {
    return 'webpack';
  }

  webpackConfig() {
    return {
      //debug: true,
      entry: null,
      output: {
        path: null,
        filename: null
      },
      module: {
        rules: []
      }
    };
  }

  run(task_name, config, callback) {
    let full = 'full' in config ? config['full'] : false;
    //let babel = 'babel' in config ? config['babel'] : true;
    let sourceMap = 'source_map' in config ? config['source_map'] : true;
    let sourceMapType = 'source_map_type' in config ? config['source_map_type'] : 'inline';
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    if (this.isProduction()) {
      sourceMap = false;
    }

    let path_to = this.path(config.to);
    let path_from = this.path(config.from);

    let storage_name = config.name ? config.name : path_from;

    let filename_from = node_path.basename(path_from);
    path_from = node_path.dirname(path_from) + '/';

    let filename_to = filename_from;
    if (node_path.extname(path_to) !== '') {
      filename_to = node_path.basename(path_to);
      path_to = node_path.dirname(path_to) + '/';
    }

    if (!(storage_name in WebpackPlugin.storage)) {
      //var myDevConfigMin = Object.create(webpackConfig);
      let myDevConfigMin = this.webpackConfig();
      myDevConfigMin.entry = path_from + filename_from;
      myDevConfigMin.output.path = path_to;
      myDevConfigMin.output.filename = filename_to;

      if (sourceMap) {
        myDevConfigMin.devtool = sourceMapType;
      }

      myDevConfigMin.module.rules.push({
        test: /\.jsx?$/,
        exclude: [/node_modules/, /public/],
        use: [
          {
            loader: 'buble-loader',
            options: {
              cacheDirectory: true,
              presets: ['env', {
                modules: false,
                targets: {
                  browsers: ['> 2%'],
                  uglify: true
                }
              }]
            }
          }
        ]
      });

      if (!full && this.isProduction()) {
        myDevConfigMin.plugins = [
          new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
          }),
          new webpack.optimize.UglifyJsPlugin({
            sourceMap: sourceMap
          }),
          // new webpack.optimize.DedupePlugin(),
          // new webpack.optimize.UglifyJsPlugin()
        ];
      }

      WebpackPlugin.storage[storage_name] = webpack(myDevConfigMin);
    }

    let _src = path_from + filename_from;
    let _dest = path_to + filename_to;

    let list = [];
    if (sourceMap) {
      if (sourceMapType === 'source-map') {
        list.push('Source map: file');
      } else {
        list.push('Source map: inline');
      }
    }

    if (!full && this.isProduction()) {
      list.push('Compress');
    }

    WebpackPlugin.storage[storage_name].run((err, stats) => {
      if (err) {
        this.report(task_name, _src, _dest, false);
        console.log(err);
      } else {
        this.report(task_name, _src, _dest, true, list);
      }

      if (callback) {
        callback.call();
      }
    });
  }
}

WebpackPlugin.storage = {};

module.exports = WebpackPlugin;