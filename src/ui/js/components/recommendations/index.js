import React, { PropTypes } from 'react';
import { sortBy } from 'lodash';

import CategoryOverview from './category-overview';
import Basic from './basic';

const Recommendations = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired
  },

  render: function() {
    const { basics } = this.props;

    const basicsByCategory = basics.reduce(function(previous, basic) {
      const category = basic.basic.category;
      if (!previous[category]) {
        previous[category] = [];
      }

      previous[category].push({
        name: basic.basic.name,
        targetId: basic.basic.slug
      });

      return previous;
    }, {});

    const sortedBasics = sortBy(basics, basic => basic.basic.name);
    const sortedCategories = Object.keys(basicsByCategory).sort();

    return (
      <div className="l--recommendations">
        <div className="l--recommendations__categories">
          {sortedCategories.map(function(categoryName, index) {
            return (
              <section className="l--recommendations__category" key={index}>
                <CategoryOverview
                  basics={basicsByCategory[categoryName]}
                  name={categoryName}
                />
              </section>
            );
          })}
        </div>

        <div className="l--recommendations__basics">
          {sortedBasics.map(function(basic, index) {
            return (
              <section className="l--recommendations__basic" key={index} id={basic.basic.slug}>
                <Basic
                  category={basic.basic.category}
                  facets={basic.facets}
                  garments={basic.garments}
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
