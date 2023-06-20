const User = require('../models/user');
const {
  ERROR_CODE_500,
  ERROR_CODE_404,
  ERROR_CODE_400,
  USER_NOT_FOUND_MESSAGE,
  INCORRECT_USER_DATA_MESSAGE,
  DATA_NOT_FOUND_MESSAGE,
  ERROR_MESSAGE,
  INCORRECT_UPDATE_USER_DATA_MESSAGE,
  INCORRECT_UPDATE_AVATAR_DATA_MESSAGE,
  INCORRECT_ADD_USER_DATA_MESSAGE,
} = require('../utils/constants');

module.exports.getAllUsersInfo = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(ERROR_CODE_404).send({ message: DATA_NOT_FOUND_MESSAGE });
    }
    return res.send(users);
  } catch (error) {
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};

module.exports.getUserInfoById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: USER_NOT_FOUND_MESSAGE });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_USER_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.name}` });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_ADD_USER_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};

module.exports.updateUserInfo = async (req, res) => {
  try {
    const { _id } = req.user;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(_id, { name, about }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: USER_NOT_FOUND_MESSAGE });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_UPDATE_USER_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(_id, { avatar }, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(ERROR_CODE_404).send({ message: USER_NOT_FOUND_MESSAGE });
    }
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: INCORRECT_UPDATE_AVATAR_DATA_MESSAGE });
    }
    return res.status(ERROR_CODE_500).send({ message: `${ERROR_MESSAGE} ${error.message}` });
  }
};
