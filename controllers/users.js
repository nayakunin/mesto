/* eslint-disable prefer-promise-reject-errors */
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.find({ _id: req.params.id })
    // eslint-disable-next-line consistent-return
    .then((result) => {
      if (result.length === 0) {
        return Promise.reject('user not found');
      }
      res.send({ data: result });
    })
    .catch(() => res.status(404).send({ message: 'user not found' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
