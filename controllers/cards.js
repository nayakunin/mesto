const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((result) => res.send({ data: result }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((result) => res.send({ data: result }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCardById = (req, res) => {
  Card.find({ owner: req.user._id })
    .then((result) => {
      let notFound = true;
      result.forEach((elem) => {
        // eslint-disable-next-line eqeqeq
        if (elem.owner == req.user._id) {
          notFound = false;
          Card.findByIdAndRemove(req.params.cardId)
            .then((card) => res.send({ data: card }))
            .catch((err) => res.status(500).send({ message: err.message }));
        }
      });
      if (notFound) res.send({ message: 'not permission' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
