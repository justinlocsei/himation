'use strict';

var Joi = require('joi');

var data = require('himation/core/data');

/**
 * A type of background task
 *
 * @typedef {HimationTaskType}
 * @property {function} process The function to process the task
 * @property {function} slug The unique slug for the task
 */
var TaskType = data.createValidator({
  process: Joi.func().required(),
  slug: Joi.string().required()
});

module.exports = {
  TaskType: TaskType
};
