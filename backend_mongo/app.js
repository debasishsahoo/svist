const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const winston = require('winston');
const config = require('config');
require('dotenv').config();
const errorHandler = require('./utils/error.handler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  winston.info('Morgan enabled...');
}


// Database connection
mongoose.connect(config.get('db'))
  .then(() => winston.info('Connected to MongoDB...'))
  .catch(err => winston.error('Could not connect to MongoDB...', err));

// Routes
//app.use('/api/auth', require('./routes/user.route'));

// Error handling
app.use(errorHandler);


module.exports = app;