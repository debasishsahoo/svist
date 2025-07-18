const app = require("./app");
const winston = require("winston");
const config = require("config");

const port = process.env.PORT || config.get("port")||5000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});

module.exports = server;
