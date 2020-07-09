const { Joi } = require('express-validation');

module.exports = {
  create: {
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
        .max(30)
        .required(),
      role: Joi.number()
        .integer()
        .valid(1, 2)
        .required(),
    }),
  },
  replace: {
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
      role: Joi.number()
        .integer()
        .valid(1, 2)
        .required(),
      blocked: Joi.boolean().required(),
    }),
    params: Joi.object({
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
  update: {
    body: Joi.object({
      username: Joi.string()
        .alphanum()
        .trim()
        .min(3)
        .max(30),
      email: Joi.string().email(),
      role: Joi.number()
        .integer()
        .valid(1, 2),
      blocked: Joi.boolean(),
    }),
    params: Joi.object({
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
  delete: {
    params: Joi.object({
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
  invite: {
    query: Joi.object({
      email: Joi.string()
        .email()
        .required(),
    }),
  },
};
