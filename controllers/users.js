const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;
const { JWT_SECRET = 'some-secret-key' } = process.env;

// /signup
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(201).send(user))
        .catch((err) => {
          if (err.code === 11000) {
            res.status(409).send({ message: 'Conflict' });
          } else if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Bad request' });
            return;
          }
          res.status(500).send({ message: 'Server error' });
        });
    });
};

// /signin
const login = (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'Unauthorized' });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(200).send({ token });
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

// /me
const currentUser = (req, res) => {
  const userId = req.user._id;
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

// /
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

// /:userId
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

// /me
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

// /me/avatar
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
  login,
  currentUser,
};
