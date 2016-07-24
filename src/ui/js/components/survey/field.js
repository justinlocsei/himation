import React, { PropTypes } from 'react';

import { childProps } from 'himation/core/extensions/react';

const SurveyField = React.createClass({

  propTypes: {
    children: childProps.multiple.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  },

  render: function() {
    const { children, slug, title } = this.props;

    return (
      <fieldset className={`l--survey__field for-${slug}`}>
        <legend className="l--survey__field__title">{title}</legend>

        <div className="l--survey__field__content">
          {children}
        </div>
      </fieldset>
    );
  }

});

export default SurveyField;
