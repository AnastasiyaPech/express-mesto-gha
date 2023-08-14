const router = require('express').Router();
const {
  findUsers,
  getUserId,
  updateUser,
  updateAvatar,
  currentUser,
} = require('../controllers/users');

router.get('/me', currentUser);
router.get('/', findUsers);
router.get('/:userId', getUserId);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
