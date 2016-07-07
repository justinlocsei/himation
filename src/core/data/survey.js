'use strict';

var CARE_TYPES = [
  {name: 'Hand wash', slug: 'hand-wash'},
  {name: 'Dry clean', slug: 'dry-clean'}
];

var FORMALITIES = [
  {name: 'Casual', slug: 'casual'},
  {name: 'Dressy casual', slug: 'dressy-casual'},
  {name: 'Business casual', slug: 'business-casual'},
  {name: 'Dressy business casual', slug: 'dressy-business-casual'},
  {name: 'Executive casual', slug: 'executive-casual'},
  {name: 'Executive', slug: 'executive'}
];

var FREQUENCIES = [
  {name: 'Never', slug: 'never'},
  {name: 'Occasionally', slug: 'rarely'},
  {name: '1-2 times per week', slug: 'sometimes'},
  {name: '3-4 times per week', slug: 'often'},
  {name: '5+ times per week', slug: 'always'}
];

var SIZES = [
  {name: 'XXS (0)', slug: 'xxs', rangeMin: 0, rangeMax: 0},
  {name: 'XS (2)', slug: 'xs', rangeMin: 2, rangeMax: 2},
  {name: 'S (4-6)', slug: 's', rangeMin: 4, rangeMax: 6},
  {name: 'M (8-10)', slug: 'm', rangeMin: 8, rangeMax: 10},
  {name: 'L (12-14)', slug: 'l', rangeMin: 12, rangeMax: 14},
  {name: 'XL (16-18)', slug: 'xl', rangeMin: 16, rangeMax: 18},
  {name: 'XXL (20-22)', slug: 'xxl', rangeMin: 20, rangeMax: 22},
  {name: 'Plus 1X (14-16)', slug: '1x-plus', rangeMin: 14, rangeMax: 16},
  {name: 'Plus 2X (18-20)', slug: '2x-plus', rangeMin: 18, rangeMax: 20},
  {name: 'Plus 3X (22-24)', slug: '3x-plus', rangeMin: 22, rangeMax: 24},
  {name: 'Plus 4X (26-28)', slug: '4x-plus', rangeMin: 26, rangeMax: 28},
  {name: 'Plus 5X (30-32)', slug: '5x-plus', rangeMin: 30, rangeMax: 32},
  {name: 'Petite XXS (0)', slug: 'xxs-petite', rangeMin: 0, rangeMax: 0},
  {name: 'Petite XS (2)', slug: 'xs-petite', rangeMin: 2, rangeMax: 2},
  {name: 'Petite S (4-6)', slug: 's-petite', rangeMin: 4, rangeMax: 6},
  {name: 'Petite M (8-10)', slug: 'm-petite', rangeMin: 8, rangeMax: 10},
  {name: 'Petite L (12-14)', slug: 'l-petite', rangeMin: 12, rangeMax: 14},
  {name: 'Petite XL (16-18)', slug: 'xl-petite', rangeMin: 16, rangeMax: 18},
  {name: 'Petite XXL (20-22)', slug: 'xxl-petite', rangeMin: 20, rangeMax: 22},
  {name: 'Tall XXS (0)', slug: 'xxs-tall', rangeMin: 0, rangeMax: 0},
  {name: 'Tall XS (2)', slug: 'xs-tall', rangeMin: 2, rangeMax: 2},
  {name: 'Tall S (4-6)', slug: 's-tall', rangeMin: 4, rangeMax: 6},
  {name: 'Tall M (8-10)', slug: 'm-tall', rangeMin: 8, rangeMax: 10},
  {name: 'Tall L (12-14)', slug: 'l-tall', rangeMin: 12, rangeMax: 14},
  {name: 'Tall XL (16-18)', slug: 'xl-tall', rangeMin: 16, rangeMax: 18},
  {name: 'Tall XXL (20-22)', slug: 'xxl-tall', rangeMin: 20, rangeMax: 22}
];

var STYLES = [
  {name: 'Caring, Empathetic', slug: 'caring-empathetic'},
  {name: 'Responsible, Trustworthy', slug: 'responsible-trustworthy'},
  {name: 'Classy, Elegant', slug: 'classy-elegant'},
  {name: 'Bold, Powerful', slug: 'bold-powerful'},
  {name: 'Creative, Fun', slug: 'creative-fun'},
  {name: 'Natural, Comfortable', slug: 'natural-comfortable'},
  {name: 'Sleek, Efficient', slug: 'sleek-efficient'}
];

module.exports = {
  CARE_TYPES: CARE_TYPES,
  FORMALITIES: FORMALITIES,
  FREQUENCIES: FREQUENCIES,
  SIZES: SIZES,
  STYLES: STYLES
};
