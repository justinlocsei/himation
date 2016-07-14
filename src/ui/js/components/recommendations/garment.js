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
      <div className="c--garment">
        <div className="c--garment__preview">
          <img src={image.url} className="c--garment__preview__image" alt={`${name} by ${brand}`} />
        </div>

        <div className="c--garment__details">
          <header className="c--garment__description">
            <h4 className="c--garment__name">{name}</h4>
            <h5 className="c--garment__brand">{brand}</h5>
          </header>

          <p className="c--garment__purchase">
            <a href={url} className="c--garment__purchase__link">
              ${formattedPrice} from {retailer}
            </a>
          </p>
        </div>
      </div>
    );
  }

});

export default Garment;
