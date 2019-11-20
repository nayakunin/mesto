const { Joi } = require('celebrate');
const { userSchema } = require('./userSchema');

const cardSchema = Joi.object({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    owner: Joi.link('#user').required(),
    likes: Joi.array().items(Joi.link('#user').required()),
    createdAt: Joi.date(),
  }),
}).id('card');

module.exports = cardSchema;
