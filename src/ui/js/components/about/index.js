import React from 'react';

import routes from 'himation/config/routes';
import { guidToRoute } from 'himation/core/routing';
import { imageSizesToDimensions, imageSizesToSrcset } from 'himation/core/images';
import { SURVEY_ANCHOR } from 'himation/core/constants';

const IMAGES = ['1x', '2x'].map(function(size) {
  const image = require(`himation/images/about/bethany-${size}.jpg`);
  return {
    height: image.height,
    path: image.src,
    size: size,
    width: image.width
  };
});

const About = React.createClass({

  render: function() {
    return (
      <div className="l--about">

        <div className="l--about__intro">

          <h2 className="l--about__intro__title">
            <span className="l--about__intro__title-phrase">Hi, I’m Bethany, and I suffer from fashion apathy.</span>
            <span className="l--about__intro__title-phrase">In the work world, this is a real disability.</span>
          </h2>

          <div className="l--about__intro__content">
            <div className="l--about__intro__bethany">
              <img className="l--about__intro__bethany-photo" src={IMAGES[0].path} srcSet={imageSizesToSrcset(IMAGES)} alt="Bethany" {...imageSizesToDimensions(IMAGES, 450)} />
            </div>

            <p className="l--about__intro__text">
              I’ve never been interested in fashion. I know, what’s wrong with me, right? Don’t all women love to shop? Well, I don’t. In college, I liked theories, ideas, politics — even math problems were more interesting to me. And it was okay. Everyone else around me was wearing jeans and T-shirts, and so was I. When I graduated, I thought I would be awesome in the real world. I had all these big ideas, I could solve problems, and I was a hard worker. What wasn’t to love? But the real world didn’t have tests I could take to prove my brilliance. The real world operated as much on the impression I left as on whether or not I did a good job.
            </p>
          </div>

        </div>

        <div className="l--about__story">

          <h2>I deluded myself for a long time that the clothes I wore weren’t THAT important</h2>
          <p>
            I wore a jean skirt to a very professional, suit-type environment without blinking an eye.  I kid you not.  Because, you know, it was a skirt, and therefore dressy. To be fair, it was one of the few dressy items I had in my closet, so I guess it was better than showing up in jean shorts — but not much better!
          </p>
          <p>
            I wasn't completely clueless, though.  I did try to buy a blazer. One article told me it was hopeless. For my shape, everything would look terrible. The best I could do was wear a cardigan and cross the professional-looking finish line by the skin of my teeth.  So I did.  For years I sat through meetings wearing a cardigan while everyone else in the room had on a blazer.  I definitely didn’t feel like I was awesome.
          </p>

          <h2>I started caring about fashion and was appalled by trying to make sense of it all</h2>
          <p>
            A decade after I entered the professional world, I decided enough was enough. I needed to make myself care about clothes whether I liked it or not. So I started asking around for advice, and the answers I got were completely useless. Some people told me I needed some nice jeans and fitted T-shirts and I’d be fine. Others told me I needed to buy full-blown matchy-matchy suits. In my workplace, neither of those extremes was right.
          </p>
          <p>
            I turned to the internet, where experts wrote articles to help people like me dress themselves. But the experts were full of it. One expert explained the “Do’s and Don’ts of Dressing for Your Shape,” and then tacked on a slideshow of examples that contradicted the advice they’d just written! Another offered no examples and sent me off to find that perfect dress for my shape. You know, the wrap dress with ruffles on the side and an asymmetrical hem in a dark color on top and a light color on the bottom. Good luck trying to find that.
          </p>

          <h2>I got so frustrated, I made my own algorithm</h2>
          <p>
            After cursing at these experts through my screen over and over again, I started to “get it.” They were finding items that were so in style, you should wear them even though they break the rules of dressing for your shape. Style trumps theory. For a fashion person, this makes sense.
          </p>
          <p>
            To me, it sounded sloppy. I wanted to shake them and scream, “You know those are two different variables, right? They shouldn’t be lumped together!” I was so fed up with the nonsense advice I was getting, I set out on a mission to make all of this make more sense. I picked apart what variables mattered the most when dressing for work. I defined what clothes a woman needs just to get off the ground. I researched what mattered for different body types. This website is the result of that effort. It takes all those crazy, contradictory variables into account, and gives you a short list of options to pick from.
          </p>
          <p>
            I use this site to shop for my own work clothes.  I hope it helps you too.
          </p>

        </div>

        <p className="l--about__cta">
          <a className="l--about__cta-button" href={`${guidToRoute(routes, 'himation.index').path}#${SURVEY_ANCHOR}`}>Get Started Now</a>
        </p>

      </div>
    );
  }

});

export default About;
