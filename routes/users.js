const userRouter = require('express').Router();
const {
  idValidation,
  linkValidation,
  userDataValidation,
} = require('../middlewares/validation');
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:id', idValidation, getUserById);
userRouter.patch('/me/avatar', linkValidation, updateUserAvatar);
userRouter.patch('/me', userDataValidation, updateUser);

module.exports = userRouter;
