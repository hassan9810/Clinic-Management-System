const express = require("express");
const controller = require("../Controller/patientController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  validatePatient,
} = require("../Middlewares/validateData");
const { setMulter } = require("../Middlewares/multer");
const upload = setMulter("patient");
const router = express.Router();


// to register new patient
router
  .route("/register")
  .post(
    upload.single("photo"),
    validatePatient,
    validatorMiddleware,
    controller.addPatient
  );


module.exports = router;
