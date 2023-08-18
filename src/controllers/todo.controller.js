const Todo = require("../models/todo.model");
const statusCode = require("../utils/constants/statusCode");

const getTodos = async (req, res) => {
  try {
    const todoList = await Todo.find();
    res.status(statusCode.OK).json(todoList);
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: err.message ?? "Something went wrong" });
  }
};

const createTodo = async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    });
    await todo.save();
    res.status(statusCode.CREATED).json(todo);
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: err.message ?? "Something went wrong" });
  }
};
const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById({
      _id: req.params.todoID,
    });
    if (!todo) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: "Todo not found" });
    }
    todo.title = req.body.title;
    todo.description = req.body.description;
    todo.completed = req.body.completed;
    await todo.save();
    res.status(statusCode.OK).json(todo);
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: err.message ?? "Something went wrong" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById({
      _id: req.params.todoID,
    });
    if (!todo) {
      return res
        .status(statusCode.NOT_FOUND)
        .json({ message: "Todo not found" });
    }
    await Todo.deleteOne({ _id: req.params.todoID });
    res.status(statusCode.OK).json({ message: "Todo Deleted" });
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json({ message: err.message ?? "Something went wrong" });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
