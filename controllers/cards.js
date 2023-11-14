const Card = require('../models/Card');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res
      .status(201)
      .send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные при создании карточки', error: error.message });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      throw new Error('Not Found');
    }
    res.send(card);
  } catch (error) {
    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Карточка с указанным id не найдена', error: error.message });
    }

    if (error.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для постановки/снятии лайка', error: error.message });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const addLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      throw new Error('Not Found');
    }
    res.send(card);
  } catch (error) {
    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Передан несуществующий id карточки', error: error.message });
    }

    if (error.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'Переданы некорректные данные для постановки/снятии лайка', error: error.message });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }
};

const removeLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!card) {
      throw new Error('Not Found');
    }
    res.send(card);
  } catch (error) {
    if (error.message === 'Not Found') {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Передан несуществующий id карточки', error: error.message });
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

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
