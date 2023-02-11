const express = require("express");
const controller = require("../Controller/clinicController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const authorizationMW = require("../Middlewares/authorizationMW");
const {
  numberIdParamsValidation,
  validateClinic,
  validatePatchClinic,
} = require("../Middlewares/validateData");

const router = express.Router();

router
  .route("/clinic")
  .all(authorizationMW.access())
  .get(controller.getAllClinics)
  .post(validateClinic, validatorMiddleware, controller.addClinic);

router
  .route("/clinic/:id")
  .all(
    numberIdParamsValidation,
    validatorMiddleware,
    authorizationMW.access()
  )
  .get(controller.getClinicById)
  .patch(validatePatchClinic, validatorMiddleware, controller.patchClinicById)
  .delete(controller.removeClinicById);

module.exports = router;
