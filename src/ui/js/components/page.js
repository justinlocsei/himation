import React, { PropTypes } from 'react';

import { childProps } from 'himation/core/extensions/react';

const Page = React.createClass({

  propTypes: {
    children: childProps.multiple,
    slug: PropTypes.string
  },

  render: function() {
    const { children, slug } = this.props;

    const classes = ['l--page'];
    if (slug) { classes.push(`for-${slug}`); }

    return (
      <div className={classes.join(' ')}>
        <main className="l--page__content">
          {children}
        </main>
      </div>
    );
  }

});

export default Page;
