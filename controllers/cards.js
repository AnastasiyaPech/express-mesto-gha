const Card = require('../models/card');

const { ValidationError } = require('../errors/validation-error');
const { ForbiddenError } = require('../errors/forbidden-error');
const { NotFoundError } = require('../errors/notfound-error');

// post /
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

// get /
const findCard = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

// /:cardId
const deleteCardId = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new Error('NoValidId'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Bad request'));
        return;
      }
      Card.findByIdAndRemove(cardId)
        .then(() => {
          res.status(200).send({ message: 'Card removed' });
        });
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('Card not found'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

// put /:cardId/likes
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('Card not found'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

// delete /:cardId/likes
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('Card not found'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

module.exports = {
  createCard,
  findCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
