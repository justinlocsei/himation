import React, { PropTypes } from 'react';

import PriceGroup from './price-group';

const PRICE_GROUP_NAMES = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

const Basic = React.createClass({

  propTypes: {
    facets: PropTypes.array.isRequired,
    garments: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired
  },

  render: function() {
    const { facets, garments, name } = this.props;

    const priceFacet = facets.find(facet => facet.slug === 'price');

    return (
      <div className="l--basic">
        <h4 className="l--basic__name">{name}</h4>
        <ol className="l--basic__price-groups">
          {priceFacet.groups.map(function(group, index) {

            const garmentIds = group.garment_ids;
            const groupGarments = garments.filter(function(garment) {
              return garmentIds.indexOf(garment.id) !== -1;
            });

            return (
              <li className="l--basic__price-group" key={index}>
                <PriceGroup name={PRICE_GROUP_NAMES[group.slug]} garments={groupGarments} />
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

});

export default Basic;
