import React, { PropTypes } from 'react';

import { childProps } from 'himation/core/extensions/react';

const SurveyField = React.createClass({

  propTypes: {
    children: childProps.multiple.isRequired,
    slug: PropTypes.string.isRequired
  },

  render: function() {
    const { children, slug } = this.props;

    return (
      <div className={`l--survey__field for-${slug}`}>
        {children}
      </div>
    );
  }

});

export default SurveyField;
