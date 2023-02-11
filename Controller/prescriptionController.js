const prescriptionSchema = require("../Models/prescriptionModel");
const patientSchema = require("../Models/patientModel");
const doctorSchema = require("../Models/doctorModel");
const clinicSchema = require("../Models/clinicModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

//get all Prescription
exports.getPrescription = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let prescription = await filterData(prescriptionSchema, query);
    prescription = sortData(prescription, query);
    prescription = paginateData(prescription, request.query);
    prescription = sliceData(prescription, request.query);
    response.status(200).json(prescription);
  } catch (error) {
    next(error);
  }
};
// Add a new prescription
exports.addPrescription = async (request, response, next) => {
  const clinic = await clinicSchema.findOne({ _id: request.body.clinic });
  if (!clinic) return response.status(400).json({ error: "Clinic not found" });

  const patient = await patientSchema.findOne({ _id: request.body.patient });
  if (!patient)
    return response.status(400).json({ error: "Patient not found" });

  const doctor = await doctorSchema.findOne({ _id: request.body.doctor });
  if (!doctor) return response.status(400).json({ error: "Doctor not found" });

  let addNewPrescription = prescriptionSchema({
    clinicRef: request.body.clinic,
    patientRef: request.body.patient,
    doctorRef: request.body.doctor,
    medications: request.body.medicine,
    instructions: request.body.instructions,
  });
  try {
    await addNewPrescription.save();
    response.status(200).json({ status: "Prescription Added" });
  } catch (error) {
    next(error);
  }
};

// Edit a Prescription
exports.editPrescription = async (request, response, next) => {
  try {
    const existingPrescription = await prescriptionSchema.findById(
      request.params.id
    );
    if (!existingPrescription) {
      return response.status(400).json({ message: "Prescription not found." });
    }

    let { clinic, patient, doctor, medicine, instructions } = request.body;
    if (clinic) {
      const isClinic = await clinicSchema.findById(clinic);
      if (!isClinic) {
        return response.status(400).json({ message: "Clinic not found." });
      }
    } else {
      clinic = existingPrescription.clinicRef;
    }

    if (patient) {
      const isPatient = await patientSchema.findById(patient);
      if (!isPatient) {
        return response.status(400).json({ message: "Patient not found." });
      }
    } else {
      patient = existingPrescription.patientRef;
    }
    if (doctor) {
      const isDoctor = await doctorSchema.findById(doctor);
      if (!isDoctor) {
        return response.status(400).json({ message: "Doctor not found." });
      }
    } else {
      doctor = existingPrescription.doctorRef;
    }
    if (!medicine) {
      medicine = existingPrescription.medications;
    }
    if (!instructions) {
      instructions = existingPrescription.instructions;
    }

    let tempPrescription = {
      clinicRef: clinic,
      patientRef: patient,
      doctorRef: doctor,
      medications: medicine,
      instructions: instructions,
    };

    const updatedPrescription = await prescriptionSchema.updateOne(
      { _id: request.params.id },
      { $set: tempPrescription }
    );
    response.status(200).json({
      message: "Prescription updated successfully.",
      updatedPrescription,
    });
  } catch (error) {
    next(error);
  }
};

// Remove a prescription
exports.removePrescription = async (request, response, next) => {
  try {
    const prescription = await prescriptionSchema.findByIdAndDelete(
      request.params.id || request.body.id
    );
    if (!prescription) {
      return next(new Error("Prescription not found"));
    }
    response
      .status(201)
      .json({ message: "prescription removed successfully.", prescription });
  } catch (error) {
    next(error);
  }
};
// Get a prescription by ID
exports.getPrescriptionById = async (request, response, next) => {
  try {
    const prescription = await prescriptionSchema.findById(request.params.id);
    if (!prescription) {
      return next(new Error("prescription not found"));
    }
    response.status(200).json({ prescription });
  } catch (error) {
    next(error);
  }
};

const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id: "_id",
    clinic: "clinicRef",
    patient: "patientRef",
    doctor: "doctorRef",
    medicine: "medications",
    instructions: "instructions",
  };

  const replacedQuery = {};
  for (const key in query) {
    let newKey = key;
    for (const replaceKey in fieldsToReplace) {
      if (key.includes(replaceKey)) {
        newKey = key.replace(replaceKey, fieldsToReplace[replaceKey]);
        break;
      }
    }
    replacedQuery[newKey] = query[key];
  }
  return replacedQuery;
};

// Edit a Prescription - put
exports.putPrescriptionById = async (request, response, next) => {
  try {
    let updatedPrescription = await prescriptionSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
          clinicRef: request.body.clinic,
          patientRef: request.body.patient,
          doctorRef: request.body.doctor,
          medications: request.body.medicine,
          instructions: request.body.instructions,
        },
      }
    );
    if (!updatedPrescription)
      response.status(200).json({ status: "Prescription not found" });
    response.status(200).json({ status: "Updated", updatedPrescription });
  } catch (error) {
    next(error);
  }
};