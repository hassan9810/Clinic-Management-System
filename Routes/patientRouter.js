const express = require("express");
const controller = require("../Controller/patientController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  validatePatient,
  validatePatchPatient,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");
const { setMulter } = require("../Middlewares/multer");
const upload = setMulter("patient");
const router = express.Router();

router
  .route("/patient")
  .all(authorizationMW.access())
  .get(controller.getAllPatients)
  .post(
    upload.single("photo"),
    validatePatient,
    validatorMiddleware,
    controller.addPatient
  );

router
  .route("/patient/:id")
  .all(
    numberIdParamsValidation,
    validatorMiddleware,
    authorizationMW.access("patient")
  )
  .get(controller.getPatientById)
  .put(upload.single("photo"),validatePatient, validatorMiddleware, controller.putPatientById)
  .patch(
    upload.single("photo"),
    validatePatchPatient,
    validatorMiddleware,
    controller.patchPatientById
  )
  .delete(controller.removePatientById);



module.exports = router;
