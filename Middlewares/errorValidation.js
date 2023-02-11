const { validationResult } = require("express-validator");
module.exports = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let errorMessage = errors
      .array()
      .map((error) => error.msg)
      .join(" , ");
    let error = new Error("💥Validation error💥" + errorMessage + "💥");
    error.status = 422;
    next(error);
  } else next();
};
