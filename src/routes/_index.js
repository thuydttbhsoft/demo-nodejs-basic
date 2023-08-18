const todoRoutes = require("./todo.route");

const express = require("express");

const route = express.Router();

route.use("/todos", todoRoutes);

module.exports = route;
