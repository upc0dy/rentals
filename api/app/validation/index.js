const { validate } = require('express-validation');

module.exports = option =>
  validate(
    option,
    { keyByField: true },
    { errors: { wrap: { label: false } }},
  );
