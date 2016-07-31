import React, { PropTypes } from 'react';
import { debounce, max, range, some, sortBy, sum, uniq } from 'lodash';

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

  handleResize: function() {

    // Gather metrics on the height and offset of each group's garments
    const groupMetrics = this._garmentsByGroup.map(function(garments) {
      return garments.map(function(garment) {
        let padding = parseInt(garment.style.paddingBottom, 10);
        if (isNaN(padding)) { padding = 0; }

        return {
          garment: garment,
          height: garment.clientHeight - padding,
          padding: padding,
          top: garment.offsetTop
        };
      });
    });

    // Determine whether any group has stacked garments by checking for
    // differing top offsets
    const garmentsAreStacked = some(groupMetrics, function(metric) {
      const tops = metric.map(garment => garment.top);
      return uniq(tops).length === tops.length;
    });

    // Abort if the garments are not stacked and no padding has been applied
    const hasPadding = some(groupMetrics, metric => some(metric, garment => garment.padding));
    if (!garmentsAreStacked && !hasPadding) { return; }

    // Cycle through each apparent row of garments and adjust the padding
    range(0, this.props.maxGarmentsPerGroup - 1).forEach(function(garmentIndex) {
      const maxHeight = max(groupMetrics.map(metric => metric[garmentIndex].height));
      groupMetrics.forEach(function(metric) {
        const garment = metric[garmentIndex];

        // If the garments are stacked and the current garment is shorter than
        // the tallest garment in the row, add padding to equalize the height
        let padding = 0;
        if (garmentsAreStacked && garment.height < maxHeight) {
          padding = maxHeight - garment.height;
        }

        garment.garment.style.paddingBottom = `${padding}px`;
      });
    });
  },

  componentWillMount: function() {
    this._garmentsByGroup = [];
    this._handleResize = debounce(this.handleResize, 50);
  },

  componentDidMount: function() {
    window.addEventListener('resize', this._handleResize);
    this.handleResize();
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this._handleResize);
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

    const garmentEls = this._garmentsByGroup;

    return (
      <div className="c--recommendations">
        <header className="c--recommendations__header">
          <p className="c--recommendations__header__category">{category}</p>
          <h2 className="c--recommendations__header__basic">{name}</h2>
        </header>

        <div className="c--recommendations__price-groups">
          {priceFacet.groups.map(function(group, groupIndex) {
            garmentEls[groupIndex] = garmentEls[groupIndex] || [];

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
                      <li className="c--recommendations__price-group__garment" key={garmentIndex} ref={function(garmentEl) { garmentEls[groupIndex][garmentIndex] = garmentEl; }}>
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
