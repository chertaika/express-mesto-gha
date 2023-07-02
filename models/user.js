const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { INVALID_AUTH_DATA_ERROR_MESSAGE } = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const checkData = (data) => {
  if (!data) throw new UnauthorizedError(INVALID_AUTH_DATA_ERROR_MESSAGE);
};

userSchema.statics.findUserByCredentials = async function checkUserData(email, password) {
  const user = await this.findOne({ email });
  checkData(user);

  const matched = await bcrypt.compare(password, user.password);
  checkData(matched);

  return user;
};

module.exports = mongoose.model('user', userSchema);
