const express = require("express");
const controller = require("./../Controller/medicineController");
const validatorMiddleware = require("../Middlewares/errorValidation");
const {
  medicineValidation,
  numberIdParamsValidation,
  medicinePatchValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");
const router = express.Router();

router
  .route("/medicine")
  .all(authorizationMW.accessClinicResources("employee", "doctor"))
  .get(controller.getAllMedicine)
  .post(medicineValidation, validatorMiddleware, controller.addMedicine);

router
  .route("/medicine/:id")
  .all(
    numberIdParamsValidation,
    validatorMiddleware,
    authorizationMW.accessClinicResources("employee", "doctor")
  )
  .get(validatorMiddleware, controller.getMedicineById)
  .put(medicineValidation, validatorMiddleware, controller.putMedicineById)
  .patch(
    medicinePatchValidation,
    validatorMiddleware,
    controller.patchMedicineById
  )
  .delete(validatorMiddleware, controller.removeMedicineById);

module.exports = router;
