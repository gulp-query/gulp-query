let build = require('../index.js');
let scss = require('../src/ScssPlugin');

build(function(query) {
  query
    .plugins([scss])
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
    .scss("scss/test_scss.scss","css/n.css",'qw')
  ;
});
