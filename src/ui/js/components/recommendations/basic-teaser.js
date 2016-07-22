import React, { PropTypes } from 'react';

const BasicTeaser = React.createClass({

  propTypes: {
    anchorId: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  },

  render: function() {
    const { anchorId, category, image, name } = this.props;

    const mediaStyle = {backgroundImage: `url(${image})`};

    return (
      <a className="c--basic-teaser" href={`#${anchorId}`}>
        <div className="c--basic-teaser__media" style={mediaStyle}>
          <img className="c--basic-teaser__media__image" src={image} />
        </div>

        <div className="c--basic-teaser__meta">
          <p className="c--basic-teaser__category">{category}</p>
          <p className="c--basic-teaser__name">{name}</p>
        </div>
      </a>
    );
  }

});

export default BasicTeaser;
