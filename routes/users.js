const userRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getUsers, getUserById } = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), getUserById);

module.exports = userRouter;
