import fastdom from 'fastdom';
import React, { PropTypes } from 'react';

import { addResizeHandler, removeResizeHandler } from 'himation/ui/events';

const Garment = React.createClass({

  propTypes: {
    averageAspectRatio: PropTypes.number.isRequired,
    brandedName: PropTypes.string.isRequired,
    care: PropTypes.string,
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
      image,
      price,
      retailer,
      url
    } = this.props;

    const dom = this._dom;
    const formattedPrice = (price / 100).toFixed(2).replace(/\.0+$/, '');

    const previewStyle = {backgroundImage: `url(${image.url})`};
    const mediaStyle = {paddingTop: `${averageAspectRatio * 100}%`};

    let metaTag;
    if (care) {
      metaTag = (
        <dl className="c--garment__meta">
          <dt className="c--garment__meta__key">Care</dt>
          <dd className="c--garment__meta__value">{care}</dd>
        </dl>
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
          this._dom.preview.classList.add('is-cropped');
        });
      }
    });
  }

});

export default Garment;
