import React, { PropTypes } from 'react';

const Garment = React.createClass({

  propTypes: {
    averageAspectRatio: PropTypes.number.isRequired,
    brand: PropTypes.string.isRequired,
    image: PropTypes.shape({
      height: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired
    }).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    retailer: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  },

  render: function() {
    const {
      averageAspectRatio,
      brand,
      image,
      name,
      price,
      retailer,
      url
    } = this.props;

    const formattedPrice = (price / 100).toFixed(2).replace(/\.0+$/, '');

    const previewStyle = {backgroundImage: `url(${image.url})`};
    const mediaStyle = {paddingTop: `${averageAspectRatio * 100}%`};

    return (
      <div className="c--garment">
        <div className="c--garment__preview" style={previewStyle}>
          <p className="c--garment__media" style={mediaStyle}>
            <img className="c--garment__media__image" src={image.url} alt={`${name} by ${brand}`} />
          </p>
        </div>

        <div className="c--garment__details">
          <header className="c--garment__description">
            <h3 className="c--garment__name">{name}</h3>
            <p className="c--garment__brand">{brand}</p>
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
