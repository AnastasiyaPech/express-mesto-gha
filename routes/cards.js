const router = require('express').Router();
const {
  createCard,
  findCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { validationCreateCard } = require('../utils/celebrate');

router.post('/', validationCreateCard, createCard);
router.get('/', findCard);
router.delete('/:cardId', deleteCardId);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
