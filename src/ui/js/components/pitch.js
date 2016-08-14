import React, { PropTypes } from 'react';

const heroNormal = require('himation/images/pitch/businesswoman-1x.jpg');
const heroLarge = require('himation/images/pitch/businesswoman-2x.jpg');

const Pitch = React.createClass({

  propTypes: {
    onRequestSurvey: PropTypes.func.isRequired,
    surveyId: PropTypes.string.isRequired
  },

  handleClick: function(e) {
    e.preventDefault();
    this.props.onRequestSurvey();
  },

  render: function() {
    const { surveyId } = this.props;

    const graphicStyles = {backgroundImage: `url(${heroLarge.src})`};
    const taglineStyles = {backgroundImage: `url(${heroNormal.src})`};

    return (
      <div className="l--pitch">
        <div className="l--pitch__content">

          <h1 className="l--pitch__tagline">
            Ladies, take the pain out of keeping your professional wardrobe
            stocked with essentials.
            <span className="l--pitch__tagline__image" style={taglineStyles} />
          </h1>

          <p className="l--pitch__details">
            We use your shape, style, and workplace formality to provide you
            with the best clothes available from a wide range of retailers.
            There’s no charge to use our site and no markup to the clothing. So
            get started now and never spend your weekend shopping for work
            clothes again.
          </p>

          <div className="l--pitch__cta">
            <a href={`#${surveyId}`} className="l--pitch__button" onClick={this.handleClick}>Fill Out Our Survey</a>
          </div>

        </div>

        <div className="l--pitch__graphic" style={graphicStyles} />
      </div>
    );
  }

});

export default Pitch;
