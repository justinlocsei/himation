import React, { PropTypes } from 'react';

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

    return (
      <div className="l--pitch">
        <div className="l--pitch__content">

          <h1 className="l--pitch__tagline">
            For women who have to wear clothes to work
          </h1>

          <p className="l--pitch__details">
            No one likes to shop for work clothes, especially not the basic ones. We simplify your hunt by using your shape, style, and workplace formality to provide you with the best clothes available from a wide range of retailers. There’s no charge to use our site and no markup to the clothing. So get started now and cover your basics the easy way.
          </p>

          <div className="l--pitch__cta">
            <a href={`#${surveyId}`} className="l--pitch__button" onClick={this.handleClick}>Get Started</a>
          </div>

        </div>

        <div className="l--pitch__graphic" style={graphicStyles} />
      </div>
    );
  }

});

export default Pitch;
