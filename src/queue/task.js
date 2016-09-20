'use strict';

var Promise = require('bluebird');
var uuid = require('node-uuid');

var errors = require('himation/core/errors');

/**
 * A task in the queue
 *
 * @typedef {HimationTask}
 * @property {string} guid The task's unique ID
 * @param {object} data The data to pass to the task runner
 * @param {string} [id] A pre-calculated ID for the task
 */
function Task(data, id) {
  this.data = data;
  this.guid = id || uuid.v4();
}

/**
 * The slug for the task
 *
 * @type {string}
 * @abstract
 */
Task.prototype.slug = null;

/**
 * Run the task on data
 *
 * This will receive the data of the current task, and must return a promise
 * describing the results of running the task.
 *
 * @abstract
 */
Task.prototype.handle = function() {
  throw new errors.ConfigurationError('A task type must define its process function');
};

/**
 * Process the task
 *
 * @returns {Promise} The result of processing the task
 * @fulfill {string} The unique ID of the task
 */
Task.prototype.process = function() {
  return this.handle(this.data)
    .then(() => Promise.resolve(this.guid));
};

module.exports = Task;
