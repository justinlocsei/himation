import React, { PropTypes } from 'react';

const BasicTeaser = React.createClass({

  propTypes: {
    anchorId: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    groupNumber: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  },

  render: function() {
    const { anchorId, category, groupNumber, image, name } = this.props;

    const mediaStyle = {backgroundImage: `url(${image})`};

    return (
      <a className="c--basic-teaser" href={`#${anchorId}`} data-group-number={groupNumber}>
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
