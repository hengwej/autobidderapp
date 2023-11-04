// validator.js
const { escape } = require('validator');
const validator = require('validator');

/**
 * Sanitizes an object's properties.
 * @param {Object} data - The object to sanitize.
 * @returns {Object} - The sanitized object.
 */
const sanitiseObj = (data) => {
  const sanitizedData = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      // Sanitize each field using sanitiseStr function
      sanitizedData[key] = sanitiseStr(data[key]);
    }
  }
  return sanitizedData;
};

/**
 * Sanitizes a string by removing potentially harmful characters.
 * @param {string} input - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
const sanitiseStr = (input) => {
  // Remove special characters prone to exploits
  return input.replace(/[<>|:;"()\/\\]/g, '');
};

module.exports = {
  sanitiseObj,
  sanitiseStr
};
// export default { validateEmail, validatePassword, validateUsername, generalValidation };