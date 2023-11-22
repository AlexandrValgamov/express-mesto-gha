const jwt = require('jsonwebtoken');
const { SERVER_ERROR } = require('../utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;
const auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error('NotAuthenticate');
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, NODE_ENV ? JWT_SECRET : 'dev_secret');
  } catch (error) {
    if (error.message === 'NotAuthenticate') {
      return res
        .status(401)
        .send({ message: 'С токеном что-то не так' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .send({ message: 'С токеном что-то не так' });
    }

    return res
      .status(SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера', error: error.message });
  }

  req.user = payload;
  console.log(req.user);
  next();
};

module.exports = auth;
