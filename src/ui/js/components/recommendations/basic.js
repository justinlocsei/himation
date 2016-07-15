import React, { PropTypes } from 'react';
import { range } from 'lodash';

import Garment from './garment';

const PRICE_GROUP_NAMES = {
  low: 'Budget',
  medium: 'Mid-Range',
  high: 'High-End'
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
    const maxGarments = Math.max.apply(undefined, priceFacet.groups.map(group => group.garment_ids.length));

    return (
      <div className="c--recommendations">
        <h2 className="c--recommendations__basic">{name}</h2>
        <table className="c--recommendations__price-groups">
          <thead>
            <tr>
              {priceFacet.groups.map(function(group, index) {
                return (
                  <th key={index} className="for-group">
                    {PRICE_GROUP_NAMES[group.slug]}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {range(maxGarments).map(function(index) {
              return (
                <tr key={index}>
                  {priceFacet.groups.map(function(group, groupIndex) {
                    const garmentId = group.garment_ids[index];
                    const garment = garments.find(g => g.id === garmentId);

                    let garmentTag;
                    if (garment) {
                      garmentTag = (
                        <div className="c--recommendations__garment">
                          <Garment {...garment} />
                        </div>
                      );
                    }

                    return (
                      <td key={`${index}-${groupIndex}`} className="for-garment">
                        {garmentTag}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

});

export default Basic;
