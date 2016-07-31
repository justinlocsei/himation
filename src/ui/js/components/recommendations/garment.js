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
        <a href={url} rel="external noopener noreferrer" className="c--garment__preview" style={previewStyle} title={`Buy for $${formattedPrice} from ${retailer}`}>
          <p className="c--garment__media" style={mediaStyle}>
            <img className="c--garment__media__image" src={image.url} alt={`${brandedName}`} />
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
  }

});

export default Garment;
