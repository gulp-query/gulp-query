let build = require('../index.js');
// let scss = require('../plugins/scss');
// let copy = require('../plugins/copy');
// let styles = require('../plugins/styles');
// let js = require('../plugins/js');
//let webpack = require('../plugins/webpack');
//let compress = require('../plugins/compress');
//let sprite = require('../plugins/sprite');
let pug = require('../plugins/pug');

build(function(query) {
  query
    .plugins([
      // scss
      // , copy
      //, styles
      //, webpack
      //, compress
      //, sprite
      //, js
      , pug
    ])
    // SCSS
    //   .scss({
    //     name: 'qq',
    //     from: "scss/test_scss.scss",
    //     to: "css/",
    //     source_map: true,
    //     // includePaths: [
    //     //   '../node_modules/compass-mixins/lib/',
    //     // ]
    //   })
    //.scss("scss/test_scss.scss", "css/n.css", 'test')
    //.scss("scss/app.scss", "css/", 'app')
    //.copy(['scss/app.scss','scss/test_scss.scss'],"cs/t.scss")
    //.copy('scss/**/*',"css/o/")
    //.copy(['css_source/1.css', 'css_source/2.css'], 'css/copy_12.css')
    //.scss("scss/*.scss","css/",'tt')

    //.styles(['1.css','2.css'],'css/12.css',{parent_folder:'css_source/'})
    //.styles('css_source/*.css','css/')
    //.styles('css_source/*.css','css/big.css')

    //.js(['js_source/admin.js', 'js_source/app.js'], 'js/full.js')
    //.js('js_source/*', 'js/')

    .pug('views/*.pug', 'html/')

    //.webpack('js_source/w.js', 'js/w.compile.js')

    // .compress([
    //   {from:'images_source/auth/*.png',to: 'auth/'},
    //   {from:'images_source/watch/*',to: 'watch/'},
    // ], 'images/')

    // .sprite([
    //   "images_source/watch/*.jpg",
    //   "images_source/auth/*.png"
    // ], {
    //   images: "images/",
    //   css: "json/"
    // }, {
    //   extension: "json",
    //   format: "json_texture"
    // })
  ;
});
