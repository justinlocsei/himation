import React, { PropTypes } from 'react';

import Basic from './basic';

const Recommendations = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired
  },

  render: function() {
    const { basics } = this.props;

    return (
      <div className="l--recommendations">
        <ul className="l--recommendations__basics">
          {basics.map(function(basic, index) {
            return (
              <li className="l--recommendations__basic" key={index}>
                <Basic facets={basic.facets} garments={basic.garments} name={basic.basic.name} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

});

export default Recommendations;
