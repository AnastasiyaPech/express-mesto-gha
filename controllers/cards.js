const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch(() => res.status(500).send('Server error'));
};

const findCard = (req, res) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const deleteCardId = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
      }
      res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
      }
      res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
      }
      res.send(card);
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

module.exports = {
  createCard,
  findCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
