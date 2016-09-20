'use strict';

var glob = require('glob');
var path = require('path');

var BaseTask = require('himation/queue/task');
var data = require('himation/queue/data');
var errors = require('himation/core/errors');

/**
 * Load all task types
 *
 * @returns {HimationTaskType[]}
 * @private
 */
function loadAll() {
  var findTasks = path.join(__dirname, 'tasks', '*.js');
  return glob.sync(findTasks).map(require);
}

/**
 * Find a task type by its slug
 *
 * @param {string} slug The slug of a task type
 * @returns {HimationTaskType}
 * @throws {DataError} If the slug is invalid
 */
function findBySlug(slug) {
  var task = loadAll().find(t => t.slug === slug);

  if (!task) {
    throw new errors.DataError('No task type exists with a slug of "' + slug + '"');
  }

  return task;
}

/**
 * Define a new task type
 *
 * @param {object} schema The definition for the task type
 * @returns {HimationTask} A task type
 */
function defineTask(schema) {
  var definition = new data.TaskType(schema);

  function Task() { BaseTask.call(this, arguments); }
  Task.prototype = Object.create(BaseTask.prototype);
  Task.prototype.slug = definition.slug;
  Task.prototype.process = definition.process;

  return Task;
}

/**
 * Create a new task from serialized data
 *
 * @param {string} serialized The serialized JSON of a task
 * @returns {HimationTask} The task instance
 */
function loadTask(serialized) {
  var parsed = JSON.parse(serialized);

  var Task = findBySlug(parsed.slug);
  return new Task(parsed.data, parsed.guid);
}

/**
 * Serialize a task as JSON
 *
 * @param {HimationTask} task An instance of a task
 * @returns {string}
 */
function serializeTask(task) {
  return JSON.stringify({
    data: task.data,
    guid: task.guid,
    slug: task.slug
  });
}

module.exports = {
  defineTask: defineTask,
  findBySlug: findBySlug,
  loadTask: loadTask,
  serializeTask: serializeTask
};
