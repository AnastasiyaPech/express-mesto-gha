const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  autoCreate: true,
  autoIndex: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});