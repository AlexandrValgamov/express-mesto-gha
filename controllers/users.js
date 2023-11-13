const User = require('../models/User');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res
      .status(200)
      .send(users);
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Not Found');
    }
    res
      .status(200)
      .send(user);
  } catch (error) {
    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь с указанным id не найден', error: error.message });
    }

    if (error.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Передан не валидный id', error: error.message });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
}

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body
    const newUser = await User.create({ name, about, avatar })
    res
      .status(201)
      .send(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные при создании пользователя', error: error.message });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res
      .status(200)
      .send(user);
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
}

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    if (!avatar) {
      throw new Error('ValidationError');
    }

    const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true });
    if (!user) {
      throw new Error('Not Found');
    }

    res
      .status(200)
      .send(user)
  } catch (error) {
    if (error.message === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные при обновлении аватара', error: error.message });
    }

    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Пользователь с указанным id не найден', error: error.message });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
}