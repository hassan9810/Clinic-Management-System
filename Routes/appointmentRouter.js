const express = require("express");
const controller = require("../Controller/appointmentController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  validateAppointment,
  validatePatchAppointment,
  numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");

const router = express.Router();

// router
//   .route("/appointment")
//   .all(authorizationMW.accessClinicResources("receptionist"))
//   .get(controller.getAllAppointments)
//   .post(validateAppointment, validatorMiddleware, controller.addAppointment);

  router
  .route("/appointment")
  .all(authorizationMW.accessAppointment("patient"))
  .get(controller.getAllAppointments)
  .post(validateAppointment, validatorMiddleware, controller.addAppointment);


router
  .route("/appointmentReports/all")
  .get(authorizationMW.access(), controller.allAppointmentsReports);

router
  .route("/appointmentReports/daily")
  .get(authorizationMW.access(), controller.dailyAppointmentsReports);

router
  .route("/appointmentReports/patient/:id")
  .get(authorizationMW.access(), controller.patientAppointmentsReports);

router
  .route("/appointmentReports/doctor/:id")
  .get(authorizationMW.access(), controller.doctorAppointmentsReports);

router
  .route("/appointment/:id")
  .all(
    numberIdParamsValidation,
    validatorMiddleware,
    authorizationMW.accessClinicResources("receptionist")
  )
  .get(controller.getAppointmentById)
  .patch(
    validatePatchAppointment,
    validatorMiddleware,
    controller.patchAppointment
  )
  .delete(controller.removeAppointmentById);

module.exports = router;
