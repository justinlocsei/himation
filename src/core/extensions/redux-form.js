'use strict';

var isArray = require('lodash/isArray');

var ARRAY_DEFINITION_MATCH = new RegExp(/(\w+)\[\]/);
var ARRAY_FIELD_MATCH = new RegExp(/\[([0-9]+)\]\.(.+)$/);

var INPUT_PROPS = [
  'name',
  'onBlur',
  'onChange',
  'onDragStart',
  'onDrop',
  'onFocus',
  'value'
];

/**
 * Extract props that canb e passed to a React input from a form field
 *
 * @param {object} field A Redux form field
 * @returns {object} The input props
 */
function extractInputProps(field) {
  return INPUT_PROPS.reduce(function(props, propName) {
    props[propName] = field[propName];
    return props;
  }, {});
}

/**
 * Pass through a field in a field array
 *
 * @param {string} field The name of the field
 * @param {string} value The field's value
 * @returns {string} The original value
 */
function passThroughTransformer(field, value) {
  return value;
}

/**
 * Convert an array field from POST data to a parsed JS object
 *
 * @param {object} data Raw POST data from the form
 * @param {string} fieldName The name of the field to extract from the POST data
 * @param {function} [transformer] An optional function to transform field values
 * @returns {object[]} The parsed array field
 */
function parseArrayField(data, fieldName, transformer) {
  var valueTransformer = transformer || passThroughTransformer;

  var fields = Object.keys(data).filter(function(field) {
    return field.indexOf(fieldName) === 0 && field[fieldName.length] === '[';
  });

  return fields.reduce(function(parsed, field) {
    var arrayFieldMatch = ARRAY_FIELD_MATCH.exec(field);
    var index = arrayFieldMatch[1];
    var subfield = arrayFieldMatch[2];

    parsed[index] = parsed[index] || {};
    parsed[index][subfield] = valueTransformer(subfield, data[field]);

    return parsed;
  }, []);
}

/**
 * Create seeded field structure from a form schema and a field/value map
 *
 * @param {string[]} schema The field definitions for the form
 * @param {object} values A mapping of field names to initial values
 * @returns {object} A drop-in replacement for a redux-form field
 */
function seedFields(schema, values) {
  return schema.reduce(function(seeded, fieldDef) {
    var arrayDefinitionMatch = ARRAY_DEFINITION_MATCH.exec(fieldDef);
    var fieldName = arrayDefinitionMatch ? arrayDefinitionMatch[1] : fieldDef;

    var fieldValue = values[fieldName];
    if (fieldValue === undefined) { return seeded; }

    if (isArray(fieldValue)) {
      seeded[fieldName] = fieldValue.map(function(value, i) {
        return Object.keys(value).reduce(function(previous, subFieldName) {
          previous[subFieldName] = {
            name: fieldName + '[' + i + '].' + subFieldName,
            value: value[subFieldName]
          };

          return previous;
        }, {});
      });
    } else {
      seeded[fieldName] = {
        name: fieldName,
        value: fieldValue
      };
    }

    return seeded;
  }, {});
}

module.exports = {
  extractInputProps: extractInputProps,
  parseArrayField: parseArrayField,
  seedFields: seedFields
};
