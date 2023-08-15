const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/users');
const routesCard = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoCreate: true,
  autoIndex: false,
});

app.use(bodyParser.json());

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/users', routes);
app.use('/cards', routesCard);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
});
app.use(errorHandler);

app.listen(PORT);
