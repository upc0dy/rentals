import validate from 'validate.js';

const constraints = {
  username: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      minimum: 3,
      tooShort: 'must be at least %{count} characters',
    },
    format: {
      pattern: '^[A-za-z]{3}[A-za-z0-9]+$',
      message: '^Only letters and numbers are allowed',
    },
  },
  email: {
    presence: { allowEmpty: false, message: "can't be blank" },
    email: {
      message: '^Please enter a valid email address',
    },
  },
  password: {
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      minimum: 6,
      tooShort: '^Your password must be at least %{count} characters',
    },
  },
  role: {
    type: 'integer',
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      lessThanOrEqualTo: 3,
    },
  },
  name: {
    type: 'string',
    presence: { allowEmpty: false, message: "can't be blank" },
    length: {
      minimum: 3,
      tooShort: 'must be at least %{count} characters',
    },
    format: {
      pattern: '^[A-za-z][A-za-z0-9 ]+$',
      message: '^Only letters and numbers are allowed',
    },
  },
  description: {
    type: 'string',
    presence: { allowEmpty: false, message: "can't be blank" },
  },
  areaSize: {
    type: 'number',
    numericality: {
      greaterThan: 0,
    },
  },
  price: {
    type: 'number',
    numericality: {
      greaterThan: 0,
    },
  },
  roomCount: {
    type: 'integer',
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
    },
  },
  latitude: {
    type: 'number',
    numericality: {
      notEqualTo: 0,
    },
  },
  longitude: {
    type: 'number',
    numericality: {
      notEqualTo: 0,
    },
  },
  skip: {
    type: 'integer',
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0,
    },
  },
};

export default (fieldName, value) => {
  let formValues = {};
  formValues[fieldName] = value;

  const result = validate(formValues, constraints);
  return result && result[fieldName] ? result[fieldName][0] : null;
};
