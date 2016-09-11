import debounce from 'lodash/debounce';
import flatten from 'lodash/flatten';
import max from 'lodash/max';
import React, { PropTypes } from 'react';
import sortBy from 'lodash/sortBy';

import Basic from './basic';
import BasicTeaser from './basic-teaser';
import { addResizeHandler } from 'himation/ui/events';

const TEASERS_ANCHOR = 'basics';

const BASIC_CHECK_INTERVAL = 1000;

const Recommendations = React.createClass({

  propTypes: {
    basics: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    isStatic: PropTypes.bool,
    onViewBasic: PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      isStatic: false
    };
  },

  shouldComponentUpdate: function() {
    return !this.props.isStatic;
  },

  componentWillMount: function() {
    this._trackedBasics = {};
  },

  componentDidMount: function() {
    this._trackBasicPositions();
    addResizeHandler(this._trackBasicPositions);

    window.addEventListener('scroll', debounce(this._updateViewedBasics, BASIC_CHECK_INTERVAL));
  },

  render: function() {
    const that = this;
    const { categories } = this.props;

    const trackedBasics = this._trackedBasics;
    const sortedBasics = this._getSortedBasics();
    const maxGarmentsPerGroup = this._getMaxGarmentsPerGroup();

    function trackBasic(el, slug) {
      trackedBasics[slug] = trackedBasics[slug] || {};
      trackedBasics[slug].ref = el;
    }

    return (
      <div className="l--recommendations">
        <h1 className="l--recommendations__title" id={TEASERS_ANCHOR}>
          <span className="l--recommendations__title__text">Your Basics</span>
        </h1>

        <ul className="l--recommendations__basic-teasers">
          {sortedBasics.map(function(basic, index) {
            return (
              <li className="l--recommendations__basic-teaser" key={index}>
                <BasicTeaser
                  anchorId={basic.basic.slug}
                  category={basic.basic.category}
                  groupNumber={categories.indexOf(basic.basic.category) + 1}
                  image={that._getBasicTeaserImage(basic).url}
                  name={basic.basic.plural_name}
                />
              </li>
            );
          })}
        </ul>

        <div className="l--recommendations__basics">
          {sortedBasics.map(function(basic, index) {
            return (
              <section className="l--recommendations__basic" key={index} id={basic.basic.slug} ref={function(el) { trackBasic(el, basic.basic.slug); }}>
                <Basic
                  category={basic.basic.category}
                  facets={basic.facets}
                  garments={basic.garments}
                  maxGarmentsPerGroup={maxGarmentsPerGroup}
                  name={basic.basic.plural_name}
                />

                <p className="l--recommendations__basic__footer">
                  <a href={`#${TEASERS_ANCHOR}`} className="l--recommendations__basic__return-link">Back to top</a>
                </p>
              </section>
            );
          })}
        </div>
      </div>
    );
  },

  /**
   * Get a list of basics ordered by their category and name
   *
   * @returns {object}
   */
  _getSortedBasics: function() {
    const basicsByCategoryName = this.props.basics.reduce(function(byCategory, basic) {
      const category = basic.basic.category;
      if (!byCategory[category]) { byCategory[category] = []; }
      byCategory[category].push(basic);
      return byCategory;
    }, {});

    return this.props.categories.reduce(function(sorted, categoryName) {
      const basics = basicsByCategoryName[categoryName];
      if (basics) {
        return sorted.concat(sortBy(basics, b => b.basic.plural_name));
      } else {
        return sorted;
      }
    }, []);
  },

  /**
   * Determine the maximum number of garments per facet group
   *
   * This value is calculated by examining the contents of each group for each
   * basic's facets and taking the largest value.
   *
   * @returns {number}
   */
  _getMaxGarmentsPerGroup: function() {
    return this.props.basics.reduce(function(maxValue, basic) {
      const garmentsPerGroup = flatten(basic.facets.map(function(facet) {
        return max(facet.groups.map(group => group.garment_ids.length));
      }));
      return Math.max(maxValue, max(garmentsPerGroup));
    }, 0);
  },

  /**
   * Determine the teaser image for a basic
   *
   * This uses the smallest image available for the recommendation with the
   * highest weight.
   *
   * @param {object} basic A basic with multiple recommendations
   * @returns {object}
   */
  _getBasicTeaserImage: function(basic) {
    const bestRecommendation = sortBy(basic.garments, g => g.weight * -1)[0];
    return sortBy(bestRecommendation.images, i => i.width * -1)[0];
  },

  /**
   * Track the position of all basics
   */
  _trackBasicPositions: function() {
    const trackedBasics = this._trackedBasics;

    Object.keys(trackedBasics).forEach(function(slug) {
      const basic = trackedBasics[slug];
      basic.top = basic.ref.offsetTop;
      basic.bottom = basic.top + basic.ref.offsetHeight;
    });
  },

  /**
   * Update the count of viewed basics based on the current scroll position
   */
  _updateViewedBasics: function() {
    const frameTop = window.scrollY;
    const frameBottom = frameTop + window.innerHeight * 0.5;

    const trackedBasics = this._trackedBasics;
    const onViewBasic = this.props.onViewBasic;

    Object.keys(trackedBasics).forEach(function(slug) {
      const basic = trackedBasics[slug];
      if (frameTop >= basic.top && frameBottom <= basic.bottom) {
        onViewBasic(slug);
      }
    });
  }

});

export default Recommendations;
