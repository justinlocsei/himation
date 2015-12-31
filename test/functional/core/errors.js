'use strict';

var errors = require('chiton/core/errors');

describe('core/errors', function() {

  describe('.subclass', function() {
    it('creates new error subclasses', function() {
      var MyError = errors.subclass();
      var error = new MyError();

      assert.instanceOf(error, Error);
      assert.instanceOf(error, MyError);
    });

    it('creates error classes that accept a message', function() {
      var MyError = errors.subclass();
      var error = new MyError('error message');

      assert.equal(error.message, 'error message');
    });

    it('can accept a custom parent subclass', function() {
      var ParentError = errors.subclass();
      var ChildError = errors.subclass(ParentError);
      var error = new ChildError();

      assert.instanceOf(error, Error);
      assert.instanceOf(error, ParentError);
      assert.instanceOf(error, ChildError);
    });
  });

});
