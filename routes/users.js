const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsersInfo,
  getUserInfoById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsersInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserInfoById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = router;
