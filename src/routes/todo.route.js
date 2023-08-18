const todoRouter = require("express").Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo.controller");
const { TodoValidate } = require("../utils/validators/todoSchema");

const { validate } = require("../middlewares/joi.middleware");
//Todo router
todoRouter.get("/", getTodos);
todoRouter.post("/", validate(TodoValidate), createTodo);
todoRouter.put("/:todoID", validate(TodoValidate), updateTodo);
todoRouter.delete("/:todoID", deleteTodo);
module.exports = todoRouter;
