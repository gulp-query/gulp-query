## Plugins for gulp-query

#### SCSS (SASS), CSS, PostCSS

* [gulp-query-postcss](https://github.com/gulp-query/gulp-query-postcss) — to provide PostCSS
* [gulp-query-scss](https://github.com/gulp-query/gulp-query-scss) — to compile SCSS with cssnano and autoprefixer
* [gulp-query-scss-images](https://github.com/gulp-query/gulp-query-scss-images) — as the previous, but with sprites-generator and assets
* [gulp-query-styles](https://github.com/gulp-query/gulp-query-styles) — concatenation, minification with cssnano and autoprefixer

#### Javascript

* [gulp-query-js](https://github.com/gulp-query/gulp-query-js) — concatenation, minification and compiling with [babel](http://babeljs.io/)
* [gulp-query-js-buble](https://github.com/gulp-query/gulp-query-js-buble) — as the previous, but is the blazing fast with [buble](https://buble.surge.sh/guide/) instead *babel*

#### Module and Bundle

* [gulp-query-webpack](https://github.com/gulp-query/gulp-query-webpack) — to compile JavaScript modules with importing css and scss. Uses [babel](http://babeljs.io/) 
* [gulp-query-webpack-buble](https://github.com/gulp-query/gulp-query-webpack-buble)  — as the previous, but is the blazing fast with [buble](https://buble.surge.sh/guide/) instead *babel*
* [gulp-query-rollup](https://github.com/gulp-query/gulp-query-rollup) — Similar to Webpack, Rollup is a next-generation bundler for ES2015. Uses [buble](https://buble.surge.sh/guide/)

#### Files and images

* [gulp-query-compress](https://github.com/gulp-query/gulp-query-compress) — Compress your images in other directory
* [gulp-query-copy](https://github.com/gulp-query/gulp-query-copy) — Combine and copy your files
* [gulp-query-sprite](https://github.com/gulp-query/gulp-query-sprite) — Generate the sprites and css or scss or json...

#### Template
 * [gulp-query-pug](https://github.com/gulp-query/gulp-query-pug) — compile Pug (Jade)
 
### How to


##### Install

```javascript
npm install gulp-query gulp-query-plugin
```

##### gulpfile.js

```javascript
let build = require('gulp-query')
  , plugin = require('gulp-query-plugin')
  , plugin2 = require('gulp-query-plugin2')
  ...
  ;

build((query) => {
  query.plugins(plugin, plugin2, ...)
    .plugin('src/*','dest/','name')
    .plugin2('src/*','dest/','name')
    ...
});
```

```javascript
gulp
gulp plugin // or gulp plugin plugin2
gulp plugin:name // or gulp plugin:name plugin2:name
gulp watch
gulp plugin watch // or gulp plugin plugin2 watch
gulp plugin:name watch // or gulp plugin:name plugin2:name watch
gulp --production
gulp plugin --production // or gulp plugin plugin2 --production
gulp plugin:name --production // or gulp plugin:name plugin2:name --production
...
```