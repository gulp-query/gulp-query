## gulp-query
Your workflow will be easier

Use only what you need

Why?
* provides an easy, convenient API for defining basic Gulp tasks for your application
* plugins for SCSS, JS, Webpack, Rollup, combining styles and js, compressing image, cooking sprite and more

### Example
Install `gulp-query` and plugins
```
npm install gulp-query gulp-query-scss gulp-query-webpack
```

Paste the code into your `gulpfile.js` and configure it
```javascript
let build = require('gulp-query')
  , scss = require('gulp-query-scss')
  , webpack = require('gulp-query-webpack');

build((query) => {
    query.plugins([scss, webpack])
      .scss('src/scss/admin.scss','css/undercover.css')
      .scss('src/scss/app.scss','css/','app')
      .webpack('src/js/app.js','js/','app')
      ;
});
```
And feel the freedom
```
gulp
gulp --production // For production (minification)
gulp watch // Watching change
gulp scss // Only for scss
gulp scss:app // Only for app.scss
gulp webpack:app watch // Watching change only for app.js nad app/**/*.js
gulp webpack --production // Production only for webpack
...
```

Easy, right?

* Compile the Sass file, `./src/scss/app.sass` to `./css/app.css` and `./src/scss/admin.sass` to `./css/undercover.css`
* Bundle all JavaScript (and any required modules) at `./src/js/app.js` to `./js/app.js`
* We can run each task separately

And it's just several lines of code. In contrast to the original... 

## Plugins