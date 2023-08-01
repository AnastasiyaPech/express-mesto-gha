const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send('Server error'));
};

const findUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      }
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Server error' }));
};

module.exports = {
  createUser,
  findUsers,
  getUserId,
};
