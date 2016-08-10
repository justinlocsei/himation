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
 * A no-op onChange handler to use when seeding fields
 */
function noOpOnChange() {}

/**
 * Create seeded field structure from a form schema and a field/value map
 *
 * This is used to create drop-in replacements for fields in a Redux form, which
 * are either missing or invalid on the first render of a component.  This
 * defines the minimum set of fields required to make the fields work with
 * code that expects Redux-form fields, and is intended only to be used for
 * server-side rendering.
 *
 * @param {string[]} schema The field definitions for the form
 * @param {object} values A mapping of field names to initial values
 * @param {object} [validationErrors] Possible validation errors
 * @returns {object} A drop-in replacement for a redux-form field
 */
function seedFields(schema, values, validationErrors) {
  var errors = validationErrors || {};
  var hasErrors = Object.keys(errors).length > 0;

  return schema.reduce(function(seeded, fieldDef) {
    var arrayDefinitionMatch = ARRAY_DEFINITION_MATCH.exec(fieldDef);
    var fieldName = arrayDefinitionMatch ? arrayDefinitionMatch[1] : fieldDef;
    var fieldValue = values[fieldName];

    if (isArray(fieldValue)) {
      seeded[fieldName] = fieldValue.map(function(value, i) {
        var field = {
          error: (errors[fieldName] || [])[i],
          touched: hasErrors
        };

        Object.keys(value).forEach(function(subFieldName) {
          field[subFieldName] = {
            name: fieldName + '[' + i + '].' + subFieldName,
            onChange: noOpOnChange,
            value: value[subFieldName]
          };
        });

        return field;
      });
    } else if (fieldValue !== undefined) {
      seeded[fieldName] = {
        error: errors[fieldName],
        name: fieldName,
        onChange: noOpOnChange,
        touched: hasErrors,
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
