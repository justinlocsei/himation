'use strict';

function index(request, response) {
  response.render('index.html');
}

module.exports = {
  index: index
};
