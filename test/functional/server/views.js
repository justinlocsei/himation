'use strict';

var parse5 = require('parse5');
var React = require('react');

var views = require('himation/server/views');

describe('server/views', function() {

  describe('.render', function() {

    function component() {
      return React.createClass({
        render: function() {
          var value = this.props.name ? 'Hello ' + this.props.name : 'Hello';
          return React.createElement('h1', null, value);
        }
      });
    }

    it('renders a React component to a string', function() {
      var markup = views.render(component());
      var result = parse5.parseFragment(markup).childNodes[0];

      assert.equal(result.tagName, 'h1');
      assert.equal(result.childNodes[0].value, 'Hello');

      var reactData = result.attrs.filter(attr => /^data-react/.test(attr.name));
      assert.isAbove(reactData.length, 0);
    });

    it('passes props to the component', function() {
      var markup = views.render(component(), {name: 'Tester'});
      var result = parse5.parseFragment(markup).childNodes[0];

      assert.equal(result.tagName, 'h1');
      assert.equal(result.childNodes[0].value, 'Hello Tester');
    });

  });

});
