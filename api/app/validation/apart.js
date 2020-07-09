const { Joi } = require('express-validation');

module.exports = {
  read: {
    query: Joi.object({
      skip: Joi.number()
        .integer()
        .min(0)
        .required(),
    }),
  },
  create: {
    body: Joi.object({
      name: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required(),
      description: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required(),
      areaSize: Joi.number()
        .integer()
        .positive()
        .required(),
      price: Joi.number()
        .integer()
        .positive()
        .required(),
      roomCount: Joi.number()
        .integer()
        .positive()
        .required(),
      latitude: Joi.number()
        .precision(6)
        .required(),
      longitude: Joi.number()
        .precision(6)
        .required(),
    }),
  },
  replace: {
    body: Joi.object({
      name: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required(),
      description: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required(),
      areaSize: Joi.number()
        .integer()
        .positive()
        .required(),
      price: Joi.number()
        .integer()
        .positive()
        .required(),
      roomCount: Joi.number()
        .integer()
        .positive()
        .required(),
      latitude: Joi.number()
        .precision(6)
        .required(),
      longitude: Joi.number()
        .precision(6)
        .required(),
      status: Joi.boolean().required(),
    }),
    params: Joi.object({
      apartId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
  update: {
    body: Joi.object({
      name: Joi.string()
        .trim()
        .min(3)
        .max(30),
      description: Joi.string()
        .trim()
        .min(3)
        .max(255),
      areaSize: Joi.number()
        .integer()
        .positive(),
      price: Joi.number()
        .integer()
        .positive(),
      roomCount: Joi.number()
        .integer()
        .positive(),
      status: Joi.boolean(),
      latitude: Joi.number().precision(6),
      longitude: Joi.number().precision(6),
    }),
    params: Joi.object({
      apartId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
  delete: {
    params: Joi.object({
      apartId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
};
