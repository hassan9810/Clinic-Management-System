/*** callback fns for CRUD operations ***/

/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const appointmentSchema = require("../Models/appointmentModel");
const doctorModel = require("../Models/doctorModel");
const patientModel = require("../Models/patientModel");
const clinicModel = require("../Models/clinicModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
  dateBetween,
  mapDateToDay,
} = require("../helper/helperfns");
const { request, response } = require("express");

// Add a new Appointment
exports.addAppointment = async (request, response, next) => {
  try {
    const { doctorId, patientId, date, time, clinicId } = request.body;
    const clinic = await clinicModel.findById(clinicId);
    if (!clinic) {
      return response
        .status(400)
        .json({ message: `Clinic ${clinicId} not found.` });
    }
    let doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return response.status(400).json({ message: "Doctor not found." });
    }
    if (doctor._clinic !== clinicId) {
      return response.status(400).json({
        message: `Doctor ${doctorId} does not work at clinic ${clinicId}.`,
      });
    }
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return response.status(400).json({ message: "Patient not found." });
    }
    let testExistingAppointment = await appointmentSchema.findOne({
      _patientId: patientId,
      _doctorId: doctorId,
      _date: date,
    });
    if (testExistingAppointment)
      return response
        .status(400)
        .json({ message: `You've already booked an appointment today` });

    const minutes = time.split(":")[1];
    if (minutes !== "00" && minutes !== "30") {
      return response
        .status(400)
        .json({ message: "Invalid time format, expected HH:00 or HH:30." });
    }

    let flagForSchedule = false;
    let dayInWeek = mapDateToDay(date);
    for (var i = 0; i < clinic._weeklySchedule.length; i++) {
      if (
        doctor._id == clinic._weeklySchedule[i].doctorId &&
        dateBetween(
          time,
          clinic._weeklySchedule[i].start,
          clinic._weeklySchedule[i].end
        ) &&
        dayInWeek == clinic._weeklySchedule[i].day
      )
        flagForSchedule = true;
      break;
    }
    if (!flagForSchedule)
      return response
        .status(400)
        .json({ message: `Doctor has no schedule at ${dayInWeek} , ${time}` });

    let newDate = date.split("/");
    newDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;

    const appointmentDate = new Date(`${newDate} ${time}:00`);
    if (appointmentDate < new Date()) {
      return response
        .status(400)
        .json({ message: "Appointment date must be in the future." });
    }

    const _id = new Date(newDate).getTime();

    const existingAppointment = await appointmentSchema.findOne({
      doctorId,
      _date: date,
      _time: time,
    });
    if (existingAppointment) {
      return response
        .status(400)
        .json({ message: "Doctor already has an appointment at this time." });
    }
    const appointment = new appointmentSchema({
      _id,
      _date: date,
      _time: time,
      _doctorId: doctorId,
      _patientId: patientId,
      _clinicId: clinicId,
    });
    let savedAppointment = await appointment.save();
    await doctorModel.findOneAndUpdate(
      { _id: doctorId },
      { $push: { _appointments: savedAppointment._id } }
    );
    response
      .status(201)
      .json({ message: "Appointment created successfully.", appointment });
  } catch (error) {
    next(error);
  }
};

// Patch appointment
exports.patchAppointment = async (request, response, next) => {
  try {
    const appointmentId = request.params.id;
    let { doctorId, patientId, date, time } = request.body;

    const existingAppointment = await appointmentSchema.findById(appointmentId);
    if (!existingAppointment) {
      return response.status(400).json({ message: "Appointment not found." });
    }

    if (doctorId) {
      const doctor = await doctorModel.findById(doctorId);
      if (!doctor) {
        return response.status(400).json({ message: "Doctor not found." });
      }

      if (doctor._clinic !== existingAppointment._clinicId) {
        return response.status(400).json({
          message: `Doctor ${doctorId} does not work at clinic ${existingAppointment._clinicId}.`,
        });
      }
    } else {
      doctorId = existingAppointment._doctorId;
    }

    if (patientId) {
      const patient = await patientModel.findById(patientId);
      if (!patient) {
        return response.status(400).json({ message: "Patient not found." });
      }
    } else {
      patientId = existingAppointment._patientId;
    }

    if (date) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!date.match(dateRegex)) {
        return response.status(400).json({ message: "Invalid date format." });
      }
    } else {
      date = existingAppointment._date;
    }

    if (time) {
      const minutes = time.split(":")[1];
      if (minutes !== "00" && minutes !== "30") {
        return response.status(400).json({ message: "Invalid time format." });
      }
    } else {
      time = existingAppointment._time;
    }

    let newDate = date.split("/");
    newDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;

    const appointmentDate = new Date(`${newDate} ${time}:00`);
    if (appointmentDate < new Date()) {
      return response
        .status(400)
        .json({ message: "Appointment date must be in the future." });
    }
    let tempAppointment = {
      _doctorId: doctorId,
      _patientId: patientId,
      _date: date,
      _time: time,
    };
    const validateAppointment = await appointmentSchema.findOne({
      _doctorId: doctorId,
      _date: date,
      _time: time,
    });
    if (validateAppointment && validateAppointment._id != appointmentId) {
      return response
        .status(400)
        .json({ message: "Doctor already has an appointment at that time." });
    }
    const updatedAppointment = await appointmentSchema.updateOne(
      { _id: request.params.id },
      { $set: tempAppointment }
    );
    response.status(200).json({
      message: "Appointment updated successfully.",
      updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// Remove appointment
exports.removeAppointmentById = async (request, response, next) => {
  try {
    const appointment = await appointmentSchema.findByIdAndRemove(
      request.params.id
    );
    if (!appointment) {
      return response.status(400).json({ message: "Appointment not found." });
    }
    response.status(200).json({ message: "Appointment removed." });
  } catch (error) {
    next(error);
  }
};

// Get all appointments
exports.getAllAppointments = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let appointments = await filterData(appointmentSchema, query, [
      { path: "_doctorId", options: { strictPopulate: false } },
      { path: "_patientId", options: { strictPopulate: false } },
      { path: "_clinicId", options: { strictPopulate: false } },
    ]);
    appointments = sortData(appointments, query);
    appointments = paginateData(appointments, request.query);
    appointments = sliceData(appointments, request.query);

    response.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
};

// Get a appointment by ID
exports.getAppointmentById = async (request, response, next) => {
  try {
    const appointment = await appointmentSchema.findById(request.params.id);
    if (!appointment) {
      return response.status(400).json({ message: "Appointment not found." });
    }
    response.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
};

// All Appointments Reports
exports.allAppointmentsReports = (request, response, next) => {
  appointmentSchema
    .find()
    .populate({ path: "_patientId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_doctorId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_clinicId", select: { _id: 0, _specilization: 1 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Appointments Daily Reports
exports.dailyAppointmentsReports = (request, response, next) => {
  let date = new Date();
  date.setHours(0, 0, 0);
  let day = 60 * 60 * 24 * 1000;
  let nextDay = new Date(date.getTime() + day);
  appointmentSchema
    .find({ date: { $gt: date, $lt: nextDay } })
    .populate({ path: "_patientId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_doctorId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_clinicId", select: { _id: 0, _specilization: 1 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Patient Appointments Reports
exports.patientAppointmentsReports = (request, response, next) => {
  appointmentSchema
    .find({ _patientId: request.params.id })
    .populate({ path: "_patientId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_doctorId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_clinicId", select: { _id: 0, _specilization: 1 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Doctor Appointments Reports
exports.doctorAppointmentsReports = (request, response, next) => {
  appointmentSchema
    .find({ _doctorId: request.params.id })
    .populate({ path: "_patientId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_doctorId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_clinicId", select: { _id: 0, _specilization: 1 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id: "_id",
    date: "_date",
    time: "_time",
    doctorId: "_doctorId",
    patientId: "_patientId",
    clinicId: "_clinicId",
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
