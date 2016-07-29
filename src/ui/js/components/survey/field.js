import React, { PropTypes } from 'react';

import { childProps } from 'himation/core/extensions/react';

const SurveyField = React.createClass({

  propTypes: {
    children: childProps.multiple.isRequired,
    help: PropTypes.string,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  },

  render: function() {
    const { children, help, slug, title } = this.props;

    let helpTag;
    if (help) {
      helpTag = <span className="l--survey__field__title__help">{help}</span>;
    }

    return (
      <fieldset className={`l--survey__field for-${slug}`}>
        <legend className="l--survey__field__title">{title}{helpTag}</legend>

        <div className="l--survey__field__content">
          {children}
        </div>
      </fieldset>
    );
  }

});

export default SurveyField;
