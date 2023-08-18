const Joi = require("joi");

const TodoValidate = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    completed: Joi.boolean().optional(),
  }),
};

module.exports = {
  TodoValidate,
};
