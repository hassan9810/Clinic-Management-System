const express = require("express");
const controller = require("../Controller/prescriptionController");
const errorValidation = require("../Middlewares/errorValidation");
const {
    validatePrescription,
    validatePatchPrescription,
    numberIdParamsValidation,
} = require("../Middlewares/validateData");
const authorizationMW = require("../Middlewares/authorizationMW");
const router = express.Router();
router
    .route("/prescription")
    .all(authorizationMW.accessClinicResources("doctor"))
    .get(controller.getPrescription)
    .post(validatePrescription, errorValidation, controller.addPrescription);

router
    .route("/prescription/:id")
    .all(numberIdParamsValidation, errorValidation, authorizationMW.accessClinicResources("doctor"))
    .get(controller.getPrescriptionById)
    .put(validatePrescription, errorValidation, controller.putPrescriptionById)
    .patch(validatePatchPrescription, errorValidation, controller.editPrescription)
    .delete(controller.removePrescription);

module.exports = router;
