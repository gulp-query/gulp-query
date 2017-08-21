let build = require('../../../index.js');
let scss = require('../index.js');

build(function(query) {
  query
    .plugins([
      scss
    ])
    .scss("scss/app.scss", "css/")
  ;
});