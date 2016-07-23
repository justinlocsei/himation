import React from 'react';

import { childProps } from 'himation/core/extensions/react';

const SurveyField = React.createClass({

  propTypes: {
    children: childProps.multiple.isRequired
  },

  render: function() {
    return (
      <div className="l--survey__field">
        {this.props.children}
      </div>
    );
  }

});

export default SurveyField;
