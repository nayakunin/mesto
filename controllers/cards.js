const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((result) => res.send({ data: result }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((result) => res.send({ data: result }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findOne({ _id: req.params.cardId, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((result) => res.send({ data: result }))
        .catch(next);
    })
    .catch(next);
};
