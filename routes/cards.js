const router = require('express').Router();
const {
  createCard,
  findCard,
  deleteCardId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { validationCreateCard, validationCardId } = require('../utils/celebrate');

router.post('/', validationCreateCard, createCard);
router.get('/', findCard);
router.delete('/:cardId', validationCardId, deleteCardId);
router.put('/:cardId/likes', validationCardId, likeCard);
router.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
