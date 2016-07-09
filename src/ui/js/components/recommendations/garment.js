import React, { PropTypes } from 'react';

const Garment = React.createClass({

  propTypes: {
    brand: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  },

  render: function() {
    const { brand, name } = this.props;

    return (
      <div className="l--garment">
        <p className="l--garment__name">{name}</p>
        <p className="l--garment__brand">{brand}</p>
      </div>
    );
  }

});

export default Garment;
