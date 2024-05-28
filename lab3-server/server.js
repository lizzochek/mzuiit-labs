"use strict";
const winston = require("winston");
const express = require("express");
const Prometheus = require("prom-client");

Prometheus.collectDefaultMetrics({ timeout: 1000 });

// Custom metrics
const totalCalls = new Prometheus.Counter({
  name: "calls_total",
  help: "Total number of calls",
  labelNames: ["result"],
});

const delays = new Prometheus.Histogram({
  name: "delays_ms",
  help: "Delay of the request in ms",
  labelNames: ["method", "route", "code"],
  buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
});

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
  totalCalls.inc({ result });
  delays.labels(req.method, req.route.path, res.statusCode).observe(transactionTime);
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

app.get("/metrics", (req, res) => {
  res.set("Content-Type", Prometheus.register.contentType);
  Prometheus.register.metrics().then((data) => res.send(data));
});

app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.json({ error: err.message });
  next();
});

app.listen(port, () => {
  console.log(`Lab3 app listening on port ${port}!`);
});
