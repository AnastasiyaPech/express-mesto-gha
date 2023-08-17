const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;
const { JWT_SECRET = 'some-secret-key' } = process.env;
const { ConflictnameError } = require('../errors/conflictname-error');
const { ValidationError } = require('../errors/validation-error');
const { UnauthorizedError } = require('../errors/unauthorized-error');
const { NotFoundError } = require('../errors/notfound-error');

// /signup
const createUser = (req, res, next) => {
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
        .then((data) => {
          const userResponse = data.toObject();
          delete userResponse.password;
          res.status(201).send(userResponse);
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictnameError('Conflict'));
          } else if (err.name === 'ValidationError') {
            next(new ValidationError('Bad request'));
            return;
          }
          next(err);
        });
    });
};

// /signin
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Unauthorized'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Unauthorized'));
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res.status(200).send({ token });
        });
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('User not found'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
      // res.status(500).send({ message: 'Server error' });
    });
};

// /me
const currentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('User not found'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

// /
const findUsers = (req, res, next) => {
  User.find({})
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('User not found'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

// /:userId
const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('User not found'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

// /me
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('User not found'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
    });
};

// /me/avatar
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: true })
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError('User not found'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Bad request'));
        return;
      }
      next(err);
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
