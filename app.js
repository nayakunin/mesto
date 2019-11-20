const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const routes = require('./routes');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());

app.use(express.static(path.join(__dirname, '/public')));
app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use('/', routes);

app.listen(PORT, () => { });
