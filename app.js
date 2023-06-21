const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_CODE_404 } = require('./utils/constants');
const { DB_ADDRESS, PORT } = require('./config');

(async () => {
  try {
    await mongoose.connect(DB_ADDRESS);
    console.log('Соединение с базой данных установлено');
  } catch (error) {
    console.log(`Ошибка соединения с базой данных ${error.message}`);
  }
})();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6491408a29889fdaa56ca250',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  res.status(ERROR_CODE_404).send({ message: 'Неверный URL запроса' });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт ${PORT}`);
});
