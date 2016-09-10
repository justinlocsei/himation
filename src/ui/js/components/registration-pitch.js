import React, { PropTypes } from 'react';

import closeImage from 'himation/images/icons/close.svg';
import Registration from 'himation/ui/components/registration';

const RegistrationPitch = React.createClass({

  propTypes: {
    isActive: PropTypes.bool,
    isComplete: PropTypes.bool,
    onBanish: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      isActive: false,
      isComplete: false
    };
  },

  handleBanishClick: function(e) {
    e.preventDefault();
    this.props.onBanish();
  },

  handleDismissClick: function(e) {
    e.preventDefault();
    this.props.onDismiss();
  },

  render: function() {
    const { isActive, isComplete } = this.props;

    const classes = ['l--registration-pitch'];
    if (isComplete) { classes.push('is-complete'); }
    if (isActive) { classes.push('is-active'); }

    let completeTag;
    if (isComplete) {
      completeTag = (
        <div className="l--registration-pitch__complete">
          <p className="l--registration-pitch__complete__text">We've added you to our list</p>
          <button onClick={this.handleBanishClick} className="l--registration-pitch__complete__dismiss">Hide this</button>
        </div>
      );
    }

    return (
      <div className={classes.join(' ')}>
        <button className="l--registration-pitch__dismiss" type="button" title="Dismiss" onClick={this.handleDismissClick}>
          <img className="l--registration-pitch__dismiss-icon" src={closeImage} alt="Dismiss" height={16} width={16} />
        </button>

        <div className="l--registration-pitch__registration">
          {completeTag}
          <Registration />
        </div>
      </div>
    );
  }

});

export default RegistrationPitch;
