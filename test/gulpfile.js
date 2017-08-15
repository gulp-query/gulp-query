let build = require('../index.js');
let scss = require('../plugins/scss');
let copy = require('../plugins/copy');

build(function(query) {
  query
    .plugins([scss, copy])
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
    .copy('scss/**/*',"css/o/")
//    .scss("scss/*.scss","css/",'tt')
  ;
});
