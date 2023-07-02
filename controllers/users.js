const User = require('../models/user');
const {
  USER_NOT_FOUND_MESSAGE,
  INCORRECT_USER_DATA_MESSAGE,
  INCORRECT_UPDATE_USER_DATA_MESSAGE,
  INCORRECT_UPDATE_AVATAR_DATA_MESSAGE,
  INCORRECT_ADD_USER_DATA_MESSAGE,
} = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const checkData = (data) => {
  if (!data) throw new NotFoundError(USER_NOT_FOUND_MESSAGE);
};

module.exports.getAllUsersInfo = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};

module.exports.getUserInfoById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    checkData(user);
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new BadRequestError(INCORRECT_USER_DATA_MESSAGE));
    }
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new BadRequestError(INCORRECT_ADD_USER_DATA_MESSAGE));
    }
    return next(error);
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(_id, { name, about }, {
      new: true,
      runValidators: true,
    });
    checkData(user);
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new BadRequestError(INCORRECT_UPDATE_USER_DATA_MESSAGE));
    }
    return next(error);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(_id, { avatar }, {
      new: true,
      runValidators: true,
    });
    checkData(user);
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return next(new BadRequestError(INCORRECT_UPDATE_AVATAR_DATA_MESSAGE));
    }
    return next(error);
  }
};
