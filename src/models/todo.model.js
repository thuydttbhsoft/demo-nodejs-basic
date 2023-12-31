const mongoose = require("mongoose");
const modelsName = require("../utils/constants/modelsName");
const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(modelsName.TODO, TodoSchema);
