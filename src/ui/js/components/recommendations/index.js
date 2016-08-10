import React, { PropTypes } from 'react';
import flatten from 'lodash/flatten';
import max from 'lodash/max';
import sortBy from 'lodash/sortBy';

import Basic from './basic';
import BasicTeaser from './basic-teaser';

const Recommendations = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired
  },

  render: function() {
    const { basics, categories } = this.props;

    const basicsByCategory = basics.reduce(function(previous, basic) {
      const category = basic.basic.category;

      if (!previous[category]) { previous[category] = []; }
      previous[category].push(basic);

      return previous;
    }, {});

    const sortedBasics = categories.reduce(function(previous, category) {
      const categoryBasics = basicsByCategory[category];
      if (categoryBasics) {
        return previous.concat(categoryBasics);
      } else {
        return previous;
      }
    }, []);

    const basicTeasers = sortedBasics.map(function(basic) {
      const bestRecommendation = sortBy(basic.garments, g => g.weight * -1)[0];
      const teaserImage = sortBy(bestRecommendation.images, i => i.width * -1)[0];

      return {
        anchorId: basic.basic.slug,
        category: basic.basic.category,
        groupNumber: categories.indexOf(basic.basic.category) + 1,
        image: teaserImage.url,
        name: basic.basic.plural_name
      };
    });

    const maxGarmentsPerGroup = sortedBasics.reduce(function(previous, basic) {
      const garmentsPerGroup = flatten(basic.facets.map(function(facet) {
        return max(facet.groups.map(group => group.garment_ids.length));
      }));
      return Math.max(previous, max(garmentsPerGroup));
    }, 0);

    return (
      <div className="l--recommendations">
        <ul className="l--recommendations__basic-teasers">
          {basicTeasers.map(function(teaser, index) {

            return (
              <li className="l--recommendations__basic-teaser" key={index}>
                <BasicTeaser {...teaser} />
              </li>
            );
          })}
        </ul>

        <div className="l--recommendations__basics">
          {sortedBasics.map(function(basic, index) {
            return (
              <section className="l--recommendations__basic" key={index} id={basic.basic.slug}>
                <Basic
                  category={basic.basic.category}
                  facets={basic.facets}
                  garments={basic.garments}
                  maxGarmentsPerGroup={maxGarmentsPerGroup}
                  name={basic.basic.name}
                />
              </section>
            );
          })}
        </div>
      </div>
    );
  }

});

export default Recommendations;
