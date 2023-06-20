const router = require('express').Router();
const {
  getAllUsersInfo,
  getUserInfoById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsersInfo);

router.get('/:userId', getUserInfoById);

router.post('/', createUser);

router.patch('/me', updateUserInfo);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
