const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
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
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Bad request' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Bad request' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Bad request' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Bad request' });
        return;
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
        return;
      }
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

module.exports = {
  createUser,
  findUsers,
  getUserId,
  updateUser,
  updateAvatar,
};
