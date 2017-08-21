## gulp-query
Your workflow will be easier

```
npm install gulp-query
```

### Example
Install `gulp-query` and plugins
```
npm install gulp-query gulp-query-scss gulp-query-webpack
```

Paste the code into your `gulpfile.js` and configure it
```javascript
let build = require('gulp-query')
  , scss = require('gulp-query-scss')
  , webpack = require('gulp-query-webpack')
;
cocktail(function (query) {
    query.plugins([scss, webpack])
      .scss('src/scss/app.scss','css/','app')
      .scss('src/scss/admin.scss','css/','admin')
      .webpack('src/js/app.js','js/','app')
      ;
});
```
And feel the freedom
```
gulp
gulp --production // For production
gulp watch // Wathing change
gulp scss // Only for scss
gulp scss:app // Only for app.scss
gulp scss:admin watch // Wathcing change only for admin.scss
gulp webpack --production // Production only for webpack
...
```