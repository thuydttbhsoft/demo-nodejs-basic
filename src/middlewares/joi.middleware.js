const Joi = require("joi");
const statusCode = require("../utils/constants/statusCode");
module.exports.validate = (schema) => (req, res, next) => {
  const options = { abortEarly: false };
  const result = Joi.compile(schema.body).validate(req.body, options);

  if (result?.error) {
    const errorMessage = result.error.details?.map((details) => {
      return { [details.context.label]: details.message };
    });
    return res.status(statusCode.BAD_REQUEST).json({ errors: errorMessage });
  }
  next();
};
