const express = require("express");
const controller = require("../Controller/employeeController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  employeeValidation,
  employeePatchValidation,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");
const { setMulter } = require("../Middlewares/multer");
const upload = setMulter("employee");
const router = express.Router();

router
  .route("/employee")
  .all(authorizationMW.access())
  .get(controller.getAllEmployees)
  .post(
    upload.single("photo"),
    employeeValidation,
    validatorMiddleware,
    controller.addEmployee
  );

router
  .route("/employee/:id")
  .all(
    numberIdParamsValidation,
    validatorMiddleware,
    authorizationMW.access("employee")
  )
  .get(controller.getEmployeeById)
  .patch(
    upload.single("photo"),
    employeePatchValidation,
    validatorMiddleware,
    controller.patchEmployee
  )
  .put(
    upload.single("photo"),
    employeeValidation,
    validatorMiddleware,
    controller.putEmployee
  )
  .delete(controller.removeEmployeeById);


module.exports = router;
