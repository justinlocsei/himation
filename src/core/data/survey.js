'use strict';

var BODY_SHAPES = [
  {name: {lower: 'pear', title: 'Pear'}, slug: 'pear'},
  {name: {lower: 'hourglass', title: 'Hourglass'}, slug: 'hourglass'},
  {name: {lower: 'inverted triangle', title: 'Inverted Triangle'}, slug: 'inverted'},
  {name: {lower: 'apple', title: 'Apple'}, slug: 'apple'},
  {name: {lower: 'rectangle', title: 'Rectangle'}, slug: 'rectangle'}
];

var CARE_TYPES = [
  {name: {lower: 'hand wash', title: 'Hand Wash'}, slug: 'hand_wash'},
  {name: {lower: 'dry clean', title: 'Dry Clean'}, slug: 'dry_clean'}
];

var FORMALITIES = [
  {name: {lower: 'casual', title: 'Casual'}, slug: 'casual'},
  {name: {lower: 'dressy casual', title: 'Dressy Casual'}, slug: 'dressy-casual'},
  {name: {lower: 'business casual', title: 'Business Casual'}, slug: 'business-casual'},
  {name: {lower: 'dressy business casual', title: 'Dressy Business Casual'}, slug: 'dressy-business-casual'},
  {name: {lower: 'executive casual', title: 'Executive Casual'}, slug: 'executive-casual'},
  {name: {lower: 'executive', title: 'Executive'}, slug: 'executive'}
];

var FREQUENCIES = [
  {name: {lower: 'never', title: 'Never'}, slug: 'never'},
  {name: {lower: 'occasionally', title: 'Occasionally'}, slug: 'rarely'},
  {name: {lower: '1-2 times per week', title: '1-2 Times per Week'}, slug: 'sometimes'},
  {name: {lower: '3-4 times per week', title: '3-4 Times per Week'}, slug: 'often'},
  {name: {lower: '5+ times per week', title: '5+ Times per Week'}, slug: 'always'}
];

var SIZE_GROUPS = [
  {
    name: {lower: 'petite', title: 'Petite'},
    slug: 'petite',
    sizes: [
      {name: {lower: 'petite XXS', title: 'Petite XXS'}, slug: 'xxs-petite', rangeMin: 0, rangeMax: 0},
      {name: {lower: 'petite XS', title: 'Petite XS'}, slug: 'xs-petite', rangeMin: 2, rangeMax: 2},
      {name: {lower: 'petite S', title: 'Petite S'}, slug: 's-petite', rangeMin: 4, rangeMax: 6},
      {name: {lower: 'petite M', title: 'Petite M'}, slug: 'm-petite', rangeMin: 8, rangeMax: 10},
      {name: {lower: 'petite L', title: 'Petite L'}, slug: 'l-petite', rangeMin: 12, rangeMax: 14},
      {name: {lower: 'petite XL', title: 'Petite XL'}, slug: 'xl-petite', rangeMin: 16, rangeMax: 18},
      {name: {lower: 'petite XXL', title: 'Petite XXL'}, slug: 'xxl-petite', rangeMin: 20, rangeMax: 22}
    ]
  },
  {
    name: {lower: 'regular', title: 'Regular'},
    slug: 'regular',
    sizes: [
      {name: {lower: 'XXS', title: 'XXS'}, slug: 'xxs', rangeMin: 0, rangeMax: 0},
      {name: {lower: 'XS', title: 'XS'}, slug: 'xs', rangeMin: 2, rangeMax: 2},
      {name: {lower: 'S', title: 'S'}, slug: 's', rangeMin: 4, rangeMax: 6},
      {name: {lower: 'M', title: 'M'}, slug: 'm', rangeMin: 8, rangeMax: 10},
      {name: {lower: 'L', title: 'L'}, slug: 'l', rangeMin: 12, rangeMax: 14},
      {name: {lower: 'XL', title: 'XL'}, slug: 'xl', rangeMin: 16, rangeMax: 18},
      {name: {lower: 'XXL', title: 'XXL'}, slug: 'xxl', rangeMin: 20, rangeMax: 22}
    ]
  },
  {
    name: {lower: 'tall', title: 'Tall'},
    slug: 'tall',
    sizes: [
      {name: {lower: 'tall XXS', title: 'Tall XXS'}, slug: 'xxs-tall', rangeMin: 0, rangeMax: 0},
      {name: {lower: 'tall XS', title: 'Tall XS'}, slug: 'xs-tall', rangeMin: 2, rangeMax: 2},
      {name: {lower: 'tall S', title: 'Tall S'}, slug: 's-tall', rangeMin: 4, rangeMax: 6},
      {name: {lower: 'tall M', title: 'Tall M'}, slug: 'm-tall', rangeMin: 8, rangeMax: 10},
      {name: {lower: 'tall L', title: 'Tall L'}, slug: 'l-tall', rangeMin: 12, rangeMax: 14},
      {name: {lower: 'tall XL', title: 'Tall XL'}, slug: 'xl-tall', rangeMin: 16, rangeMax: 18},
      {name: {lower: 'tall XXL', title: 'Tall XXL'}, slug: 'xxl-tall', rangeMin: 20, rangeMax: 22}
    ]
  },
  {
    name: {lower: "women's", title: "Women's"},
    slug: 'womens',
    sizes: [
      {name: {lower: 'plus 1X', title: 'Plus 1X'}, slug: '1x-plus', rangeMin: 14, rangeMax: 16},
      {name: {lower: 'plus 2X', title: 'Plus 2X'}, slug: '2x-plus', rangeMin: 18, rangeMax: 20},
      {name: {lower: 'plus 3X', title: 'Plus 3X'}, slug: '3x-plus', rangeMin: 22, rangeMax: 24},
      {name: {lower: 'plus 4X', title: 'Plus 4X'}, slug: '4x-plus', rangeMin: 26, rangeMax: 28},
      {name: {lower: 'plus 5X', title: 'Plus 5X'}, slug: '5x-plus', rangeMin: 30, rangeMax: 32}
    ]
  }
];

var SIZES = SIZE_GROUPS.reduce(function(sizes, group) {
  return sizes.concat(group.sizes);
}, []);

var STYLES = [
  {name: {lower: 'caring, empathetic', title: 'Caring, Empathetic'}, slug: 'caring-empathetic'},
  {name: {lower: 'responsible, trustworthy', title: 'Responsible, Trustworthy'}, slug: 'responsible-trustworthy'},
  {name: {lower: 'classy, elegant', title: 'Classy, Elegant'}, slug: 'classy-elegant'},
  {name: {lower: 'bold, powerful', title: 'Bold, Powerful'}, slug: 'bold-powerful'},
  {name: {lower: 'creative, fun', title: 'Creative, Fun'}, slug: 'creative-fun'},
  {name: {lower: 'natural, comfortable', title: 'Natural, Comfortable'}, slug: 'natural-comfortable'},
  {name: {lower: 'sleek, efficient', title: 'Sleek, Efficient'}, slug: 'sleek-efficient'}
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
