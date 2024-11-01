require("express-async-errors");
const express = require("express");
const requests = require("../routes/requests");
const admin = require("../routes/admins")
const error = require("../middleware/error");
const users = require("../routes/users");
module.exports = function (app) {
  app.use(express.json());
  app.use("/api/sendRequests",requests);
  app.use("/api/admin",admin);
  app.use("/api/users",users);
  app.use(error);
  };