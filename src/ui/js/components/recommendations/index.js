import React, { PropTypes } from 'react';
import { sortBy } from 'lodash';

import Basic from './basic';

const Recommendations = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired
  },

  render: function() {
    const { basics } = this.props;

    const basicsByName = sortBy(basics, basic => basic.basic.name);

    return (
      <div className="l--recommendations">
        <div className="l--recommendations__basics">
          {basicsByName.map(function(basic, index) {
            return (
              <section className="l--recommendations__basic" key={index}>
                <Basic facets={basic.facets} garments={basic.garments} name={basic.basic.name} />
              </section>
            );
          })}
        </div>
      </div>
    );
  }

});

export default Recommendations;
