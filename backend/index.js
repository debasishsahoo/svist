const express = require('express');

//Configuration file
const config = require('config');
require('dotenv').config();
  
const app = express();
const PORT = process.env.PORT || config.get('server.port') || 3000;
const HOST = process.env.HOST || config.get('server.host') || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server started and running on http://${HOST}:${PORT}`);
});