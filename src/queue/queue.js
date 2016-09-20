'use strict';

var Promise = require('bluebird');
var redis = require('redis');

var errors = require('himation/core/errors');
var settings = require('himation/core/settings');
var tasks = require('himation/queue/tasks');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

// The names of the Redis data structures used to back the queue
var QUEUE_LIST = 'queued';
var TASKS_HASH = 'tasks';
var WORKING_LIST = 'working';

/**
 * Create a new queue for handling background tasks
 */
function Queue() {

}

/**
 * Add a task to the queue
 *
 * @param {string} slug The slug of a task type
 * @param {object} data The data to associate with the task
 * @returns {Promise} The result of adding the task
 * @fulfill {number} The number of enqueued tasks
 */
Queue.prototype.addTask = function(slug, data) {
  var Task = tasks.findBySlug(slug);
  var task = new Task(data);
  var serialized = tasks.serializeTask(task);

  var client = this._getRedisClient();
  return client.multi()
    .hmset(TASKS_HASH, task.guid, serialized)
    .lpush(QUEUE_LIST, task.guid)
    .execAsync();
};

/**
 * Process the next task on the queue
 *
 * @returns {Promise} The result of processing the task
 * @fulfill {HimationTask} The processed task
 */
Queue.prototype.processNextTask = function() {
  var client = this._getRedisClient();

  return client
    .rpoplpushAsync(QUEUE_LIST, WORKING_LIST)
    .then(taskId => client.hgetAsync(taskId))
    .then(function(serialized) {
      var task = tasks.loadTask(serialized);
      return task.process();
    })
    .then(function(taskId) {
      return client.multi()
        .lrem(WORKING_LIST, 0, taskId)
        .lrem(QUEUE_LIST, 0, taskId)
        .execAsync();
    })
    .catch(function(taskId) {
      return client.multi()
        .lrem(WORKING_LIST, 0, taskId)
        .rpoplpushAsync(QUEUE_LIST, QUEUE_LIST)
        .execAsync();
    });
};

/**
 * Get a memoized instance of a Redis client
 *
 * @returns {redis.RedisClient}
 */
Queue.prototype._getRedisClient = function() {
  if (this._redis) { return this._redis; }

  var redisClient = redis.createClient(settings.redisUrl);

  redisClient.on('error', function(error) {
    throw new errors.DataError('Redis error: ' + error);
  });

  this._redis = redisClient;
  return redisClient;
};

module.exports = Queue;
