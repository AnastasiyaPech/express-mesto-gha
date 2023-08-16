const router = require('express').Router();
const {
  findUsers,
  getUserId,
  updateUser,
  updateAvatar,
  currentUser,
} = require('../controllers/users');

const { validationGetUserId, validationUpdateUser, validationUpdateAvatar } = require('../utils/celebrate');

router.get('/me', currentUser);
router.get('/', findUsers);
router.get('/:userId', validationGetUserId, getUserId);
router.patch('/me', validationUpdateUser, updateUser);
router.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
