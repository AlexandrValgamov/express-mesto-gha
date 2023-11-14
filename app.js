const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.get('/', (req, res) => {
  res.send({ message: 'Hello!' });
});

app.use((req, res, next) => {
  req.user = {
    _id: '655366604017ef5cfe4d4578', // вставьте сюда _id созданного пользователя
  };

  next();
});

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
