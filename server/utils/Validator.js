// validator.js
const { escape } = require('validator');
const validator = require('validator');

// const sanitiseObj = (data) => {
//   const sanitizedData = {};
//   for (const key in data) {
//     if (data.hasOwnProperty(key)) {
//       // Validate and sanitize each field using validator.escape()
//       sanitizedData[key] = validator.escape(data[key]);
//     }
//   }
//   return sanitizedData;
// };

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

const sanitiseStr = (input) => {
  // Remove special characters prone to exploits
  return input.replace(/[<>|:;"()\/\\]/g, '');
};
  
  // const validateEmail = (email) => {
  //   const normalizedEmail = sanitizeInput(email.trim().toLowerCase());
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(normalizedEmail) ? normalizedEmail : null;
  // };
  
  // const validatePassword = (password) => {
  //   const sanitizedPassword = sanitizeInput(password.trim());
  //   return sanitizedPassword.length > 8 ? sanitizedPassword : null;
  // };
  
  // const validateUsername = (username) => {
  //   const sanitizedUsername = sanitizeInput(username.trim());
  //   return sanitizedUsername;
  // };
  
  // const generalValidation = (input) => {
  //   // Remove special characters prone to exploits
  //   return sanitizeInput(input.trim());
  // };
  
  module.exports = {
    sanitiseObj,
    sanitiseStr
  };
// export default { validateEmail, validatePassword, validateUsername, generalValidation };
  