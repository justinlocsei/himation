import fastdom from 'fastdom';
import React, { PropTypes } from 'react';

import { addClass } from 'himation/core/dom';
import { addResizeHandler, removeResizeHandler } from 'himation/ui/events';

const Garment = React.createClass({

  propTypes: {
    averageAspectRatio: PropTypes.number.isRequired,
    brandedName: PropTypes.string.isRequired,
    care: PropTypes.string,
    hasMultipleColors: PropTypes.bool.isRequired,
    image: PropTypes.shape({
      height: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired
    }).isRequired,
    price: PropTypes.number.isRequired,
    retailer: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  },

  componentWillMount: function() {
    this._dom = {
      image: null,
      preview: null
    };
  },

  componentDidMount: function() {
    addResizeHandler(this._optimizeImageScaling);
    this._optimizeImageScaling();
  },

  componentDidUpdate: function() {
    this._optimizeImageScaling();
  },

  componentWillUnmount: function() {
    removeResizeHandler(this._optimizeImageScaling);
  },

  handleClick: function() {
    const tracker = window.ga;
    if (!tracker) { return; }

    tracker('send', {
      hitType: 'event',
      eventCategory: 'Garments',
      eventAction: 'view',
      eventLabel: this.props.brandedName
    });
  },

  render: function() {
    const {
      averageAspectRatio,
      brandedName,
      care,
      hasMultipleColors,
      image,
      price,
      retailer,
      url
    } = this.props;

    const dom = this._dom;
    const formattedPrice = (price / 100).toFixed(2).replace(/\.0+$/, '');

    const previewStyle = {backgroundImage: `url(${image.url})`};
    const mediaStyle = {paddingTop: `${averageAspectRatio * 100}%`};

    const meta = [];
    if (hasMultipleColors) { meta.push({value: 'More colors available', slug: 'colors'}); }
    if (care) { meta.push({value: care, slug: 'care'}); }

    let metaTag;
    if (care) {
      metaTag = (
        <ul className="c--garment__meta">
          {meta.map(function(metum, index) {
            return <li className={`c--garment__metum for-${metum.slug}`} key={index}>{metum.value}</li>;
          })}
        </ul>
      );
    }

    return (
      <div className="c--garment">
        <a href={url} rel="external noopener noreferrer" className="c--garment__preview" style={previewStyle} title={`Buy for $${formattedPrice} from ${retailer}`} target="_blank" ref={function(el) { dom.preview = el; }} onClick={this.handleClick}>
          <p className="c--garment__media" style={mediaStyle}>
            <img className="c--garment__media__image" src={image.url} alt={`${brandedName}`} ref={function(el) { dom.image = el; }} />
          </p>
        </a>

        <div className="c--garment__details">
          <p className="c--garment__price">${formattedPrice}</p>

          <div className="c--garment__branding">
            <p className="c--garment__branding__brand">{retailer}</p>
            <p className="c--garment__branding__name">{brandedName}</p>
          </div>

          {metaTag}
        </div>
      </div>
    );
  },

  /**
   * Optimize the scaling of the garment's image
   *
   * This compares the height of the garment image with that of its container,
   * and applies a special class to all images that meet or exceed their
   * container's height, which indicates that they are being cropped.
   */
  _optimizeImageScaling: function() {
    fastdom.measure(() => {
      const imageHeight = this._dom.image.getBoundingClientRect().height;
      const previewHeight = this._dom.preview.getBoundingClientRect().height;

      if (imageHeight >= previewHeight) {
        fastdom.mutate(() => {
          addClass('is-cropped', this._dom.preview);
        });
      }
    });
  }

});

export default Garment;
