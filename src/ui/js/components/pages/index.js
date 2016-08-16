import React from 'react';

import { childProps } from 'himation/core/extensions/react';

const Page = React.createClass({

  propTypes: {
    children: childProps.multiple
  },

  render: function() {
    const { children } = this.props;

    return (
      <div className="l--page">
        <main className="l--page__content">
          {children}
        </main>
      </div>
    );
  }

});

export default Page;
