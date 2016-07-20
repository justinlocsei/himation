import React, { PropTypes } from 'react';

const CategoryOverview = React.createClass({

  propTypes: {
    basics: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      targetId: PropTypes.string.isRequired
    })).isRequired,
    name: PropTypes.string.isRequired
  },

  render: function() {
    const { basics, name } = this.props;

    return (
      <div className="c--category-overview">
        <h2 className="c--category-overview__name">{name}</h2>
        <ul className="c--category-overview__basics">
          {basics.map(function(basic, index) {
            return (
              <li className="c--category-overview__basic" key={index}>
                <a className="c--category-overview__basic__name" href={`#${basic.targetId}`}>{basic.name}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

});

export default CategoryOverview;
