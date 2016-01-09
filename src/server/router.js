'use strict';

var express = require('express');

/**
 * Create a new router to handle requests
 *
 * @returns {express.Router}
 */
function create() {
  return express.Router(); // eslint-disable-line new-cap
}

module.exports = {
  create: create
};
