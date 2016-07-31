import anime from 'animejs';
import React, { PropTypes } from 'react';

const ERROR_CLASS = 'js-survey-error';

/**
 * Scroll the page to the first error instance
 *
 * @param {function} done A function to call once the error is focused
 */
export function scrollToFirstError(done) {
  const error = document.querySelector(`.${ERROR_CLASS}`);

  if (error) {
    const bounding = error.getBoundingClientRect();
    const errorTop = bounding.top + window.pageYOffset;

    anime({
      targets: ['body'],
      scrollTop: errorTop - bounding.height * 0.25,
      duration: 500,
      easing: 'easeOutCubic',
      complete: done
    });
  } else {
    done();
  }
}

const SurveyErrorMessage = React.createClass({

  propTypes: {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    className: PropTypes.string
  },

  render: function() {
    const { children, className } = this.props;

    return <p className={`${className} ${ERROR_CLASS}`}>{children}</p>;
  }

});

export default SurveyErrorMessage;
