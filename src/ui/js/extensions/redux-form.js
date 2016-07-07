const ARRAY_FIELD_MATCH = new RegExp(/\[([0-9]+)\]\.(.+)$/);

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
export function parseArrayField(data, fieldName, transformer = passThroughTransformer) {
  const fields = Object.keys(data).filter(function(field) {
    return field.indexOf(fieldName) === 0 && field[fieldName.length] === '[';
  });

  return fields.reduce(function(parsed, field) {
    const arrayFieldMatch = ARRAY_FIELD_MATCH.exec(field);
    const index = arrayFieldMatch[1];
    const subfield = arrayFieldMatch[2];

    parsed[index] = parsed[index] || {};
    parsed[index][subfield] = transformer(subfield, data[field]);

    return parsed;
  }, []);
}
