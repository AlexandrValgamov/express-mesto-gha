// const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:id', getUserById);
userRouter.patch('/me/avatar', updateUserAvatar);
userRouter.patch('/me', updateUser);

module.exports = userRouter;
