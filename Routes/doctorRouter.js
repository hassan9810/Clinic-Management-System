const express = require("express");
const controller = require("../Controller/doctorController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const authorizationMW = require("../Middlewares/authorizationMW");
const {
  doctorValidation,
  doctorPatchValidation,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const router = express.Router();
const { setMulter } = require("../Middlewares/multer");
const upload = setMulter("doctor");

router
  .route("/doctor")
  .all(authorizationMW.access())
  .get(controller.getAllDoctors)
  .post(
    upload.single("photo"),
    doctorValidation,
    validatorMiddleware,
    controller.addDoctor
  );

router
  .route("/doctor/:id")
  .all(numberIdParamsValidation, validatorMiddleware,authorizationMW.access("doctor"))
  .get(controller.getDoctorById)
  .put(
    upload.single("photo"),
    doctorValidation,
    validatorMiddleware,
    controller.putDoctorById
  )
  .patch(
    upload.single("photo"),
    doctorPatchValidation,
    validatorMiddleware,
    controller.patchDoctorById
  )
  .delete(controller.removeDoctorById);

module.exports = router;
