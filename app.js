const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/users');
const routesCard = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoCreate: true,
  autoIndex: false,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64c9351ffbf57bd60e9e16bb',
  };

  next();
});

app.use('/users', routes);
app.use('/cards', routesCard);

app.listen(PORT);
