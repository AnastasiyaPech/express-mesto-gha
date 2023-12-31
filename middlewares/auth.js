const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'some-secret-key' } = process.env;
const { UnauthorizedError } = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Unauthorized'));
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
