const userRouter = require('express').Router();
const { getUsers, getUserById, createUser, updateUser, updateUserAvatar } = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me/avatar', updateUserAvatar);
userRouter.patch('/me', updateUser);

module.exports = userRouter;