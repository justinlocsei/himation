'use strict';

var BODY_SHAPES = [
  {name: 'Pear', slug: 'pear'},
  {name: 'Hourglass', slug: 'hourglass'},
  {name: 'Inverted triangle', slug: 'inverted'},
  {name: 'Apple', slug: 'apple'},
  {name: 'Rectangle', slug: 'rectangle'}
];

var CARE_TYPES = [
  {name: 'Hand wash', slug: 'hand_wash'},
  {name: 'Dry clean', slug: 'dry_clean'}
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

var SIZE_GROUPS = [
  {
    name: 'Petite',
    slug: 'petite',
    sizes: [
      {name: 'Petite XXS', slug: 'xxs-petite', rangeMin: 0, rangeMax: 0},
      {name: 'Petite XS', slug: 'xs-petite', rangeMin: 2, rangeMax: 2},
      {name: 'Petite S', slug: 's-petite', rangeMin: 4, rangeMax: 6},
      {name: 'Petite M', slug: 'm-petite', rangeMin: 8, rangeMax: 10},
      {name: 'Petite L', slug: 'l-petite', rangeMin: 12, rangeMax: 14},
      {name: 'Petite XL', slug: 'xl-petite', rangeMin: 16, rangeMax: 18},
      {name: 'Petite XXL', slug: 'xxl-petite', rangeMin: 20, rangeMax: 22}
    ]
  },
  {
    name: 'Regular',
    slug: 'regular',
    sizes: [
      {name: 'XXS', slug: 'xxs', rangeMin: 0, rangeMax: 0},
      {name: 'XS', slug: 'xs', rangeMin: 2, rangeMax: 2},
      {name: 'S', slug: 's', rangeMin: 4, rangeMax: 6},
      {name: 'M', slug: 'm', rangeMin: 8, rangeMax: 10},
      {name: 'L', slug: 'l', rangeMin: 12, rangeMax: 14},
      {name: 'XL', slug: 'xl', rangeMin: 16, rangeMax: 18},
      {name: 'XXL', slug: 'xxl', rangeMin: 20, rangeMax: 22}
    ]
  },
  {
    name: 'Tall',
    slug: 'tall',
    sizes: [
      {name: 'Tall XXS', slug: 'xxs-tall', rangeMin: 0, rangeMax: 0},
      {name: 'Tall XS', slug: 'xs-tall', rangeMin: 2, rangeMax: 2},
      {name: 'Tall S', slug: 's-tall', rangeMin: 4, rangeMax: 6},
      {name: 'Tall M', slug: 'm-tall', rangeMin: 8, rangeMax: 10},
      {name: 'Tall L', slug: 'l-tall', rangeMin: 12, rangeMax: 14},
      {name: 'Tall XL', slug: 'xl-tall', rangeMin: 16, rangeMax: 18},
      {name: 'Tall XXL', slug: 'xxl-tall', rangeMin: 20, rangeMax: 22}
    ]
  },
  {
    name: 'Women\'s',
    slug: 'womens',
    sizes: [
      {name: 'Plus 1X', slug: '1x-plus', rangeMin: 14, rangeMax: 16},
      {name: 'Plus 2X', slug: '2x-plus', rangeMin: 18, rangeMax: 20},
      {name: 'Plus 3X', slug: '3x-plus', rangeMin: 22, rangeMax: 24},
      {name: 'Plus 4X', slug: '4x-plus', rangeMin: 26, rangeMax: 28},
      {name: 'Plus 5X', slug: '5x-plus', rangeMin: 30, rangeMax: 32}
    ]
  }
];

var SIZES = SIZE_GROUPS.reduce(function(sizes, group) {
  return sizes.concat(group.sizes);
}, []);

var STYLES = [
  {name: 'Caring, Empathetic', slug: 'caring-empathetic'},
  {name: 'Responsible, Trustworthy', slug: 'responsible-trustworthy'},
  {name: 'Classy, Elegant', slug: 'classy-elegant'},
  {name: 'Bold, Powerful', slug: 'bold-powerful'},
  {name: 'Creative, Fun', slug: 'creative-fun'},
  {name: 'Natural, Comfortable', slug: 'natural-comfortable'},
  {name: 'Sleek, Efficient', slug: 'sleek-efficient'}
];

var MAX_STYLES = 3;
var MAX_STYLES_WORD = 'three';

var MAX_BIRTH_YEAR = new Date().getFullYear();
var MIN_BIRTH_YEAR = MAX_BIRTH_YEAR - 100;

module.exports = {
  BODY_SHAPES: BODY_SHAPES,
  CARE_TYPES: CARE_TYPES,
  FORMALITIES: FORMALITIES,
  FREQUENCIES: FREQUENCIES,
  MAX_BIRTH_YEAR: MAX_BIRTH_YEAR,
  MAX_STYLES: MAX_STYLES,
  MAX_STYLES_WORD: MAX_STYLES_WORD,
  MIN_BIRTH_YEAR: MIN_BIRTH_YEAR,
  SIZE_GROUPS: SIZE_GROUPS,
  SIZES: SIZES,
  STYLES: STYLES
};
