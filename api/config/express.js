require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const strategies = require('./passport');
const routes = require('../app/routes');
const error = require('../app/middlewares/error');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../avatars')));
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
passport.use('facebook', strategies.facebook);
passport.use('google', strategies.google);

app.use('/api', routes);

app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

module.exports = app;
