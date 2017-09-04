## Plugins for gulp-query

#### SCSS (SASS), Less, CSS, PostCSS

* [PostCSS](https://github.com/gulp-query/gulp-query-postcss) — To provide PostCSS
* [SCSS](https://github.com/gulp-query/gulp-query-scss) — To compile SCSS with cssnano and autoprefixer
* [SCSS with images](https://github.com/gulp-query/gulp-query-scss-images) — As the previous, but with sprites-generator and assets
* [Less](https://github.com/gulp-query/gulp-query-less) — To compile Less with cssnano and autoprefixer
* [Stylus](https://github.com/gulp-query/gulp-query-stylus) — To compile Stylus with cssnano and autoprefixer
* [CSS](https://github.com/gulp-query/gulp-query-css) — Concatenation CSS files, minification with cssnano and autoprefixer

#### Javascript

* [JS with Babel](https://github.com/gulp-query/gulp-query-js) — Concatenation, minification and compiling with [babel](http://babeljs.io/)
* [JS with Buble](https://github.com/gulp-query/gulp-query-js-buble) — As the previous, but is the blazing fast with [buble](https://buble.surge.sh/guide/) instead *babel*

#### Module and Bundle

* [Webpack with Babel](https://github.com/gulp-query/gulp-query-webpack) — To compile JavaScript modules with importing css and scss. Uses [babel](http://babeljs.io/) 
* [Webpack with Buble](https://github.com/gulp-query/gulp-query-webpack-buble)  — As the previous, but is the blazing fast with [buble](https://buble.surge.sh/guide/) instead *babel*
* [Rollup](https://github.com/gulp-query/gulp-query-rollup) — Similar to Webpack, Rollup is a next-generation bundler for ES2015. Uses [buble](https://buble.surge.sh/guide/)
* [React](https://github.com/gulp-query/gulp-query-react) — To compile React apps

#### Files and images

* [Compress images](https://github.com/gulp-query/gulp-query-compress) — Compress your images in other directory
* [Sprite maker](https://github.com/gulp-query/gulp-query-sprite) — Generate the sprites and css or scss or json...
* [Copy files and directories](https://github.com/gulp-query/gulp-query-copy) — Combine and copy your files
* [Remove files and directories](https://github.com/gulp-query/gulp-query-clean) — Remove your files and directories

#### Hot reload
* [Browser Sync](https://github.com/gulp-query/gulp-query-browser-sync) — Tracks changes and reloads Browsers 


#### Template
 * [Pug (Jade)](https://github.com/gulp-query/gulp-query-pug) — Compile Pug (Jade)
 
### How to

##### Install

```text
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

```text
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