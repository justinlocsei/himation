import React, { PropTypes } from 'react';

import Garment from './garment';

const PriceGroup = React.createClass({

  propTypes: {
    garments: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired
  },

  render: function() {
    const { garments, name } = this.props;

    return (
      <div className="c--price-group">
        <h5 className="c--price-group__name">{name}</h5>
        <ol className="c--price-group__garments">
          {garments.map(function(garment, index) {
            return (
              <li className="c--price-group__garment" key={index}>
                <Garment {...garment} />
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

});

export default PriceGroup;
