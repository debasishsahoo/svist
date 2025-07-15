const express = require('express');

//Configuration file
const config = require('config');
require('dotenv').config();

// Importing  routes
const userRoutes = require('./routes/user.routes');
  
const app = express();
const PORT = process.env.PORT || config.get('server.port') || 3000;
const HOST = process.env.HOST || config.get('server.host') || 'localhost';

app.use(express.json());
app.use('/api/users', userRoutes);







app.listen(PORT, HOST, () => {
  console.log(`Server started and running on http://${HOST}:${PORT}`);
});