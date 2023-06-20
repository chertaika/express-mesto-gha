const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

(async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    console.log('Соединение установлено');
  } catch (error) {
    console.log(`Ошибка соединения ${error.message}`);
  }
})();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Приложение слушает порт ${PORT}`);
});
