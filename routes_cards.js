const cardRouter = require('express').Router();
const { getCards, createCard, deleteCardById } = require('./controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:cardId', deleteCardById);

module.exports = cardRouter;
