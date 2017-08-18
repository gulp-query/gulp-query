let build = require('../index.js');
let scss = require('../plugins/scss');
let copy = require('../plugins/copy');
let styles = require('../plugins/styles');
let js = require('../plugins/js');

build(function(query) {
  query
    .plugins([scss, copy,styles,js])
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
    //   .scss("scss/test_scss.scss","css/n.css",'test')
    //.scss("scss/app.scss", "css/", 'app')
    //.copy(['scss/app.scss','scss/test_scss.scss'],"cs/t.scss")
    //.copy('scss/**/*',"css/o/")
//    .scss("scss/*.scss","css/",'tt')
    //.styles(['1.css','2.css'],'css/12.css',{parent_folder:'css_source/'})
    //.copy(['css_source/1.css','css_source/2.css'],'css/copy_12.css')
    .js('js_source/app.js','js/app.js')
  ;
});
