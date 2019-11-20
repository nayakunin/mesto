const cardRouter = require('express').Router();
const { getCards, createCard, deleteCardById } = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardById);

module.exports = cardRouter;
