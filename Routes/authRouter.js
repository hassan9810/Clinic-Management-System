const express = require("express");
const controller = require("../Controller/authController");
const { validateLogin } = require("../Middlewares/validateData");
const router = express.Router();

router.route("/login").post(validateLogin, controller.login);

module.exports = router;
