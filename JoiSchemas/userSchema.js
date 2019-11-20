const { Joi } = require('celebrate');

const userSchema = Joi.object({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}).id('user');

module.exports = userSchema;
