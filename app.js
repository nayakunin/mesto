const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

const userRoutes = require('./routes_users');
const cardRoutes = require('./routes_cards');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, '/public')));
app.use((req, res, next) => {
  req.user = {
    _id: '5db6019b7a7d4a2e40e69d75',
  };

  next();
});
app.use('/', userRoutes);
app.use('/', cardRoutes);
app.use('/', routes);

app.listen(PORT, () => { });
