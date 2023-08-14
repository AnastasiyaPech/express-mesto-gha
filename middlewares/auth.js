const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'some-secret-key' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const token = authorization.replace('Bearer ', '');
  console.log(token);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log(payload);
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
