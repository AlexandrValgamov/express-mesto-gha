const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.all('/*', auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
