const express = require("express");
const controller = require("../Controller/invoiceController");
const errorValidation = require("../Middlewares/errorValidation");
const {
  validateInvoice,
  validatePatchInvoice,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");

const router = express.Router();

router
  .route("/invoice")
  .all(authorizationMW.accessClinicResources("doctor","employee"))
  .get(controller.getInvoices)
  .post(validateInvoice, errorValidation, controller.addInvoice);

  router
  .route("/invoiceReports/all")
  .get(authorizationMW.access(), controller.allInvoicesReports);

  router
  .route("/invoiceReports/daily")
  .get(authorizationMW.access(), controller.dailyInvoicesReports);

  router
  .route("/invoiceReports/patient/:id")
  .get(authorizationMW.access(), controller.patientInvoicesReports);

router
  .route("/invoice/:id")
  .all(authorizationMW.access())
  .get(controller.getInvoiceById)
  .patch(validatePatchInvoice, errorValidation, controller.editInvoice)
  .delete(controller.removeInvoice);

module.exports = router;
