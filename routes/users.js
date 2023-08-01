const router = require('express').Router();
const { createUser, findUsers, getUserId } = require('../controllers/users');

router.post('/', createUser);
router.get('/', findUsers);
router.get('/:userId', getUserId);

module.exports = router;
