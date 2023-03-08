const express = require("express");
const controller = require("../Controller/paymentController");
const errorValidation = require("../Middlewares/errorValidation");
const {
  validatePayment,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");


const router = express.Router();

router.route("/pay/:id").post(authorizationMW.accessPay("patient"),validatePayment, errorValidation, controller.addPayment);

module.exports = router;
