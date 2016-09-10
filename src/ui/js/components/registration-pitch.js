import React, { PropTypes } from 'react';

import closeImage from 'himation/images/icons/close.svg';
import Registration from 'himation/ui/components/registration';

const RegistrationPitch = React.createClass({

  propTypes: {
    isActive: PropTypes.bool,
    isDismissed: PropTypes.bool,
    onDismiss: PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      isActive: false,
      isDismissed: false
    };
  },

  handleDismissClick: function(e) {
    e.preventDefault();
    this.props.onDismiss();
  },

  render: function() {
    const { isActive, isDismissed } = this.props;

    const classes = ['l--registration-pitch'];
    if (isDismissed) {
      classes.push('is-dismissed');
    } else if (isActive) {
      classes.push('is-active');
    }

    return (
      <div className={classes.join(' ')}>
        <button className="l--registration-pitch__dismiss" type="button" title="Dismiss" onClick={this.handleDismissClick}>
          <img className="l--registration-pitch__dismiss-icon" src={closeImage} alt="Dismiss" height={16} width={16} />
        </button>

        <div className="l--registration-pitch__registration">
          <Registration />
        </div>
      </div>
    );
  }

});

export default RegistrationPitch;
