const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const { regex } = require('../utils/constants');
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getUserInfo);

userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), getUserById);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
}), updateUserAvatar);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

module.exports = userRouter;
