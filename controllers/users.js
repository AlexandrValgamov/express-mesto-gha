const bcrypt = require('bcrypt');
const User = require('../models/User');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');
const generateToken = require('../utils/jwt');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
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
    res.send(user);
  } catch (error) {
    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({
          message: 'Пользователь с указанным id не найден',
          error: error.message,
        });
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
};

const getUserInfo = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('Not Found');
    }
    res.send({
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({
          message: 'Пользователь с указанным id не найден',
          error: error.message,
        });
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
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new Error('Not Found');
    }
    res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные при обновлении профиля',
          error: error.message,
        });
    }

    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({
          message: 'Пользователь с указанным id не найден',
          error: error.message,
        });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    if (!avatar) {
      throw new Error('ValidationError');
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new Error('Not Found');
    }

    res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные при обновлении аватара',
          error: error.message,
        });
    }

    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({
          message: 'Пользователь с указанным id не найден',
          error: error.message,
        });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const createUser = async (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(201).send(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные при создании пользователя',
          error: error.message,
        });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('NotAuthenticate');
    }
    const matched = await bcrypt.compare(String(password), user.password);
    if (!matched) {
      throw new Error('NotAuthenticate');
    }

    const token = generateToken({ _id: user._id });
    res.send({ token });
  } catch (error) {
    if (error.message === 'NotAuthenticate') {
      return res
        .status(401)
        .send({ message: 'Неправильные почта или пароль' });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserInfo,
  updateUser,
  updateUserAvatar,
  createUser,
  login,
};
