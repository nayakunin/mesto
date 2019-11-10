/* eslint-disable prefer-promise-reject-errors */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

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
  const {
    email, password, name, about, avatar,
  } = req.body;

  // add email validator
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentionals(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { httpOnly: true });
      res.status(201).send({ user, token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
