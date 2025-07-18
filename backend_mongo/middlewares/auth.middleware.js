const jwt = require('jsonwebtoken');
const config = require('config');
const winston = require('winston');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (ex) {
    winston.error('Invalid token', ex);
    res.status(400).send('Invalid token');
  }
};