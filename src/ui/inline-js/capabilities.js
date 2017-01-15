// The prefixes to use when testing for CSS properties
var CSS_PREFIXES = ['', 'Webkit'];

// The CSS feature detects
var CSS_FEATURES = [
  {
    feature: 'flexbox',
    properties: ['flexBasis', 'flexWrap']
  }
];

// A cached reference to the root HTML element
var HTML = document.documentElement;

/**
 * Create a class name for a feature
 *
 * @param {string} feature The base name of the feature
 * @param {boolean} isSupported Whether the feature is supported
 * @returns {string}
 */
function makeSupportClassName(feature, isSupported) {
  return 'supports-' + (isSupported ? feature : 'no-' + feature);
}

/**
 * Convert a list of properties into prefixed property accessors
 *
 * @param {string[]} properties CSS property names
 * @returns {string[]} The property accessors
 */
function makePropertyAccessors(properties) {
  var property, propertyUppercase, prefix;
  var accessors = [];

  for (var i = 0; i < properties.length; i++) {
    property = properties[i];
    propertyUppercase = property.charAt(0).toUpperCase() + property.slice(1);

    for (var j = 0; j < CSS_PREFIXES.length; j++) {
      prefix = CSS_PREFIXES[j];
      accessors.push(prefix ? prefix + propertyUppercase : property);
    }
  }

  return accessors;
}

/**
 * Return a class name to describe support for a set of CSS properties
 *
 * @param {string} feature The class name to add if the feature is not supported
 * @param {string[]} properties The kebab-case CSS property names
 * @returns {boolean} Whether the properties are supported
 */
function makeFeatureClassName(feature, properties) {
  var accessors = makePropertyAccessors(properties);

  for (var i = 0; i < accessors.length; i++) {
    if (HTML.style[accessors[i]] === undefined) {
      return makeSupportClassName(feature, false);
    }
  }

  return makeSupportClassName(feature, true);
}

var classes = HTML.className.replace(
  makeSupportClassName('js', false),
  makeSupportClassName('js', true)
);

for (var i = 0; i < CSS_FEATURES.length; i++) {
  classes += ' ' + makeFeatureClassName(CSS_FEATURES[i].feature, CSS_FEATURES[i].properties);
}

HTML.className = classes;
