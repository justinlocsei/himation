import React, { PropTypes } from 'react';

import { childProps } from 'himation/core/extensions/react';

const SurveySection = React.createClass({

  propTypes: {
    children: childProps.multiple.isRequired,
    name: PropTypes.string
  },

  render: function() {
    const { children, name } = this.props;

    let nameTag;
    if (name) {
      nameTag = <h3 className="l--survey__section__title">{name}</h3>;
    }

    return (
      <div className="l--survey__section">
        {nameTag}

        <div className="l--survey__section__fields">
          {children}
        </div>
      </div>
    );
  }

});

export default SurveySection;
