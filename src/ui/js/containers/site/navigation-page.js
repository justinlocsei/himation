import React, { PropTypes } from 'react';

const NavigationPage = React.createClass({

  propTypes: {
    name: PropTypes.string.isRequired,
    url: PropTypes.string
  },

  getDefaultProps: function() {
    return {
      url: '#'
    };
  },

  render: function() {
    const { name, url } = this.props;

    return (
      <li className="l--site__navigation__page">
        <a href={url} className="l--site__navigation__link">{name}</a>
      </li>
    );
  }

});

export default NavigationPage;
