const express = require("express");
const controller = require("../Controller/showAppointmentsController");

const router = express.Router();

// to show available appointemnt
router
    .route("/home")
    .get(controller.getAllWeeklySchedule);

module.exports = router;






