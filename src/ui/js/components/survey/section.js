import React, { PropTypes } from 'react';

import { childProps } from 'himation/core/extensions/react';

const SurveySection = React.createClass({

  propTypes: {
    children: childProps.multiple.isRequired,
    name: PropTypes.string.isRequired
  },

  render: function() {
    const { children, name } = this.props;

    return (
      <div className="c--survey__section">
        <h3 className="c--survey__section__title">{name}</h3>

        <div className="c--survey__section__fields">
          {children}
        </div>
      </div>
    );
  }

});

export default SurveySection;
