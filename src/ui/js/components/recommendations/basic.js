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
    category: PropTypes.string.isRequired,
    facets: PropTypes.array.isRequired,
    garments: PropTypes.array.isRequired,
    maxGarmentsPerGroup: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  },

  render: function() {
    const { category, facets, garments, maxGarmentsPerGroup, name } = this.props;

    const priceFacet = facets.find(facet => facet.slug === 'price');

    const garmentsByGroup = priceFacet.groups.map(function(group) {
      const groupGarments = garments.filter(garment => group.garment_ids.indexOf(garment.id) !== -1);
      const sortedGarments = sortBy(groupGarments, garment => garment.price);

      return sortedGarments.map(function(garment) {
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
        <header className="c--recommendations__header">
          <p className="c--recommendations__header__category">{category}</p>
          <h2 className="c--recommendations__header__basic">{name}</h2>
        </header>

        <div className="c--recommendations__price-groups">
          {priceFacet.groups.map(function(group, groupIndex) {
            return (
              <section className="c--recommendations__price-group" key={groupIndex}>
                <h3 className="c--recommendations__price-group__name">{PRICE_GROUP_NAMES[group.slug]}</h3>
                <ol className="c--recommendations__price-group__garments">
                  {range(0, maxGarmentsPerGroup).map(function(garmentIndex) {
                    const garment = garmentsByGroup[groupIndex][garmentIndex];

                    let garmentTag;
                    if (garment) {
                      garmentTag = <Garment {...garment} averageAspectRatio={averageAspectRatio} />;
                    } else {
                      garmentTag = <p className="c--recommendations__price-group__placeholder">Out of stock</p>;
                    }

                    return (
                      <li className="c--recommendations__price-group__garment" key={garmentIndex}>
                        {garmentTag}
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </div>
      </div>
    );
  }

});

export default Basic;
