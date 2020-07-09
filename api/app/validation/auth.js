const { Joi } = require('express-validation');

module.exports = {
  login: {
    query: Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
    }),
  },
  register: {
    body: Joi.object({
      username: Joi.string()
        .alphanum()
        .trim()
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
      role: Joi.number()
        .integer()
        .min(1)
        .max(3)
        .required(),
    }),
  },
  verify: {
    params: Joi.object({
      token: Joi.string()
        .max(128)
        .required(),
    }),
  },
  socialAuth: {
    query: Joi.object({
      access_token: Joi.string().required(),
    }),
  },
};
