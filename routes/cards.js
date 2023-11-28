const cardRouter = require('express').Router();
const { cardDataValidation, cardIdValidation } = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', cardDataValidation, createCard);
cardRouter.delete('/:cardId', cardIdValidation, deleteCard);
cardRouter.put('/:cardId/likes', cardIdValidation, addLike);
cardRouter.delete('/:cardId/likes', cardIdValidation, removeLike);

module.exports = cardRouter;
