let build = require('../index.js');
let scss = require('../src/ScssPlugin');

build(function(query) {
  query
    .plugins([scss])
  // SCSS
    .scss({
      from: "scss/test_scss.scss",
      to: "css/",
      source_map: true,
      // includePaths: [
      //   '../node_modules/compass-mixins/lib/',
      // ]
    })
  ;
});
