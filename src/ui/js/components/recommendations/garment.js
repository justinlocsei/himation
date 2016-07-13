import React, { PropTypes } from 'react';

const Garment = React.createClass({

  propTypes: {
    brand: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({
      height: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired
    })).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    retailer: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  },

  render: function() {
    const {
      brand,
      images,
      name,
      price,
      retailer,
      url
    } = this.props;

    const formattedPrice = (price / 100).toFixed(2).replace(/\.0+$/, '');
    const image = images[images.length - 1];

    return (
      <div className="l--garment">
        <button className="l--garment__media">
          <img src={image.url} height={image.height} width={image.width} className="l--garment__image" alt={`${name} by ${brand}`} />
        </button>

        <div className="l--garment__details">
          <header className="l--garment__description">
            <h4 className="l--garment__name">{name}</h4>
            <h5 className="l--garment__brand">{brand}</h5>
          </header>

          <p className="l--garment__purchase">
            <a href={url} className="l--garment__purchase__link">
              ${formattedPrice} from {retailer}
            </a>
          </p>
        </div>
      </div>
    );
  }

});

export default Garment;
