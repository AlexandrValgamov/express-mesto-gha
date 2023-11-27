const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const UNAUTHORIZED = 401;
const regex = /https?:\/\/(www\.)?[\w-]+\.[a-zA-Z\d._~:?#[\]/@!$&'()*+,;=-]{2,}#?/;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
  regex,
};
