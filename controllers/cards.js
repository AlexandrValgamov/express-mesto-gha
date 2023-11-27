const Card = require('../models/Card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    // .orFail(new NotFoundError('Карточки не найдены'));
    res.send(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res
      .status(201)
      .send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    }
    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  try {
    const checkCard = await Card
      .findById(cardId)
      .orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    if (String(checkCard.owner) !== userId) throw new ForbiddenError('Нельзя удалять карточки других пользователей');

    const card = await Card
      .findByIdAndDelete(cardId)
      .orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Передан некорректный _id'));
    }

    next(error);
  }
};

const addLike = async (req, res, next) => {
  try {
    const card = await Card
      .findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true },
      )
      .orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятия лайка'));
    }
    next(error);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const card = await Card
      .findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true },
      )
      .orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные для постановки/снятия лайка'));
    }
    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
