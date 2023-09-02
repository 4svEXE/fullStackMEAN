// import express from 'express'; //
const express = require("express");

// Mongo)
const mongoose = require("mongoose");

const passport = require("passport");

// Yarn add for can read the req.body.varName
const bodyParser = require("body-parser");

// Cors)
const cors = require("cors");

// Pretty loging
const morgan = require("morgan");

const keys = require("./config/keys");

mongoose
  .connect(keys.MONGO_URL + keys.DB_NAME)
  .then(() => {
    console.log("Momgo connected");
  })
  .catch((error) => console.error(error));

// Require routes
const authRoutes = require("./routes/auth");
const analysticsRoutes = require("./routes/analytics");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");
const positionRoutes = require("./routes/position");

// Init the app
const app = express();

// Add passport
app.use(passport.initialize());
require("./middleware/passport")(passport);

// IN THE CONSOLE: POST /api/auth/login 200 49.549 ms - 52
app.use(morgan("dev"));

// To can read - req.body.varName
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// USE Routes
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analysticsRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/position", positionRoutes);

// To start>> npm run server
module.exports = app;
