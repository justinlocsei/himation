import React, { PropTypes } from 'react';

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
    this._optimizeImageScaling();
  },

  componentDidUpdate: function() {
    this._optimizeImageScaling();
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
        <a href={url} rel="external noopener noreferrer" className="c--garment__preview" style={previewStyle} title={`Buy for $${formattedPrice} from ${retailer}`} target="_blank" ref={function(el) { dom.preview = el; }}>
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
    const imageHeight = this._dom.image.getBoundingClientRect().height;
    const previewHeight = this._dom.preview.getBoundingClientRect().height;

    if (imageHeight >= previewHeight) {
      this._dom.preview.classList.add('is-cropped');
    }
  }

});

export default Garment;
