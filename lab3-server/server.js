"use strict";
const winston = require("winston");
const express = require("express");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "lab3-service" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res, next) => {
  res.redirect("/random");
});

app.get("/random", (req, res, next) => {
  const result = Math.floor(Math.random() * 100) > 30;
  const transactionTime = Math.round(Math.random() * 100);
  if (!result) {
    next(new Error("Sorry! Your number is less than 30."));
    logger.error("Error happened", { errCode: "1", transactionTime });
  } else {
    setTimeout(() => {
      res.json({ status: "All good!", transactionTime: transactionTime + "ms" });
      next();
    }, transactionTime);
    logger.info("Transaction successfull", { transactionTime });
  }
});

app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.json({ error: err.message });
  next();
});

const server = app.listen(port, () => {
  console.log(`Lab3 app listening on port ${port}!`);
});
