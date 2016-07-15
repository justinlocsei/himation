import React, { PropTypes } from 'react';
import { range, sortBy, sum } from 'lodash';

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

    const garmentsByGroup = priceFacet.groups.map(function(group) {
      const groupGarments = garments.filter(garment => group.garment_ids.indexOf(garment.id) !== -1);

      return groupGarments.map(function(garment) {
        const largestImage = sortBy(garment.images, image => image.width * -1)[0];
        return {
          ...garment,
          image: largestImage
        };
      });
    });

    const aspectRatios = garmentsByGroup.reduce(function(previous, groupGarments) {
      return previous.concat(groupGarments.map(function(garment) {
        return garment.image.height / garment.image.width;
      }));
    }, []);

    let averageAspectRatio = 1;
    if (aspectRatios.length) {
      averageAspectRatio = sum(aspectRatios) / aspectRatios.length;
    }

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
                  {garmentsByGroup.map(function(groupGarments, groupIndex) {
                    const garment = groupGarments[index];

                    let garmentTag;
                    if (garment) {
                      garmentTag = (
                        <div className="c--recommendations__garment">
                          <Garment {...garment} averageAspectRatio={averageAspectRatio} />
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
