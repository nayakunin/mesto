const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('./controllers/users');
const { getCards, createCard, deleteCardById } = require('./controllers/cards');

router.get('/users', getUsers);
router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCardById);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
