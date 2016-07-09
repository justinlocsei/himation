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
      <div className="l--price-group">
        <h5 className="l--price-group__name">{name}</h5>
        <ol className="l--price-group__garments">
          {garments.map(function(garment, index) {
            return (
              <li className="l--price-group__garment" key={index}>
                <Garment
                  brand={garment.garment.brand}
                  name={garment.garment.name}
                />
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

});

export default PriceGroup;
