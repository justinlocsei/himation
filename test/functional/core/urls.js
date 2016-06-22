'use strict';

var urls = require('himation/core/urls');

describe('core/urls', function() {

  describe('.relativeToAbsolute', function() {

    it('adds a relative URL to an absolute base URL', function() {
      var url = urls.relativeToAbsolute('relative', 'http://example.com');
      assert.equal(url, 'http://example.com/relative');
    });

    it('respects paths in absolute roots', function() {
      var url = urls.relativeToAbsolute('leaf', 'http://example.com/branch');
      assert.equal(url, 'http://example.com/branch/leaf');
    });

    it('requires a protocol in order to treat the URL as absolute', function() {
      var url = urls.relativeToAbsolute('/root', 'http://example.com');
      assert.equal(url, 'http://example.com/root');
    });

    it('treats protocol-relative URLs as absolute URLs', function() {
      var url = urls.relativeToAbsolute('//example.net', 'http://example.com');
      assert.equal(url, '//example.net');
    });

    it('replaces the absolute base URL when given an absolute URL', function() {
      var url = urls.relativeToAbsolute('http://example.net', 'http://example.com');
      assert.equal(url, 'http://example.net');
    });

  });

  describe('.expandHostname', function() {

    it('adds a protocol to a hostname', function() {
      var host = urls.expandHostname('example.com');
      assert.equal(host, 'http://example.com');
    });

    it('accepts a custom protocol', function() {
      var host = urls.expandHostname('example.com', {protocol: 'https'});
      assert.equal(host, 'https://example.com');
    });

    it('accepts a custom port', function() {
      var host = urls.expandHostname('example.com', {port: 3000});
      assert.equal(host, 'http://example.com:3000');
    });

    it('ignores a custom port if it is the default for the protocol', function() {
      var http = urls.expandHostname('example.com', {protocol: 'http', port: 80});
      var https = urls.expandHostname('example.com', {protocol: 'https', port: 443});

      assert.equal(http, 'http://example.com');
      assert.equal(https, 'https://example.com');
    });

    it('allows for the creation of protocol-relative hosts', function() {
      var host = urls.expandHostname('example.com', {protocol: '//'});
      assert.equal(host, '//example.com');
    });

    it('allows a path to be specified', function() {
      var host = urls.expandHostname('example.com', {path: 'sub/path'});
      assert.equal(host, 'http://example.com/sub/path');
    });

    it('ignores leading slashes in the path', function() {
      var host = urls.expandHostname('example.com', {path: '/path'});
      assert.equal(host, 'http://example.com/path');
    });

  });

  describe('.joinPaths', function() {

    it('joins path components into a single path', function() {
      var path = urls.joinPaths(['one', 'two', 'three']);
      assert.equal(path, 'one/two/three');
    });

    it('returns an absolute path when the first component is absolute', function() {
      var path = urls.joinPaths(['/one', 'two', 'three']);
      assert.equal(path, '/one/two/three');
    });

    it('omits the trailing slash', function() {
      var path = urls.joinPaths(['one', 'two', 'three/']);
      assert.equal(path, 'one/two/three');
    });

    it('removes duplicate slashes', function() {
      var path = urls.joinPaths(['/one//', '/two/', '/three/']);
      assert.equal(path, '/one/two/three');
    });

    it('preserves multi-part paths', function() {
      var path = urls.joinPaths(['one/two', 'three', 'four']);
      assert.equal(path, 'one/two/three/four');
    });

    it('preserves a root path', function() {
      var path = urls.joinPaths(['/']);
      assert.equal(path, '/');
    });

  });

});
