const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET, NODE_ENV } = process.env;
const auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedError('С токеном что-то не так');
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, NODE_ENV ? JWT_SECRET : 'dev_secret');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('С токеном что-то не так'));
    }
    next(error);
  }

  req.user = payload;
  next();
};

module.exports = auth;
