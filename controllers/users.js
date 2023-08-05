const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Bad request' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const findUsers = (req, res) => {
  User.find({})
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res.status(404).send({ message: 'User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Bad request' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res.status(404).send({ message: 'User not found' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Bad request' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res.status(404).send({ message: 'User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Bad request' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: true })
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res.status(404).send({ message: 'User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Bad request' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

module.exports = {
  createUser,
  findUsers,
  getUserId,
  updateUser,
  updateAvatar,
};
