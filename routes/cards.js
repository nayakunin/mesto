const cardRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getCards, createCard, deleteCardById } = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    owner: Joi.string().required(),
  }).unknown(true),
}), createCard);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), deleteCardById);

module.exports = cardRouter;
