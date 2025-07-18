const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "info",
    })
  );

  winston.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: config.get("db"),
      level: "error",
    })
  );
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

};
