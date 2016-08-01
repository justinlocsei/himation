import anime from 'animejs';
import React, { PropTypes } from 'react';

const BasicTeaser = React.createClass({

  propTypes: {
    anchorId: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    groupNumber: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  },

  handleClick: function(e) {
    e.preventDefault();

    const basic = document.getElementById(this.props.anchorId);
    const bounding = basic.getBoundingClientRect();
    const basicTop = bounding.top + window.pageYOffset;

    anime({
      targets: ['body', 'html'],
      scrollTop: basicTop,
      duration: 1000,
      easing: 'easeOutCubic'
    });
  },

  render: function() {
    const { anchorId, category, groupNumber, image, name } = this.props;

    const mediaStyle = {backgroundImage: `url(${image})`};

    return (
      <a className="c--basic-teaser" href={`#${anchorId}`} data-group-number={groupNumber} onClick={this.handleClick}>
        <div className="c--basic-teaser__media" style={mediaStyle}></div>
        <div className="c--basic-teaser__meta">
          <p className="c--basic-teaser__category">{category}</p>
          <p className="c--basic-teaser__name">{name}</p>
        </div>
      </a>
    );
  }

});

export default BasicTeaser;
