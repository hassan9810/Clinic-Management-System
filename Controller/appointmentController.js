/*** callback fns for CRUD operations ***/


/* require all needed modules */
const appointmentSchema = require("../Models/appointmentModel");
const doctorModel = require("../Models/doctorModel");
const patientModel = require("../Models/patientModel");
const clinicModel = require("../Models/clinicModel");
const userModel = require("../Models/usersModel");
/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
  dateBetween,
  mapDateToDay,
} = require("../helper/helperfns");

// Add a new Appointment
exports.addAppointment = async (request, response, next) => {
  try {
    const { doctorId, date, time, clinicId } = request.body;
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
    const userType = request.userData.role;
    const userId = request.userData.id;
    if (userType === "doctor" && userId === doctorId) {
      return response
        .status(400)
        .json({ message: "Doctors cannot create appointments with themselves." });
    }
    let patient;
    if (userType === "patient") {
      patient = await patientModel.findById(userId);
      if (!patient) {
        return response.status(400).json({ message: "Patient not found." });
      }
    }
    const testExistingAppointment = await appointmentSchema.findOne({
      userId,
      _doctorId: doctorId,
      _date: date,
    });
    if (testExistingAppointment) {
      return response
        .status(400)
        .json({ message: `You've already booked an appointment today` });
    }

    const minutes = time.split(":")[1];
    if (minutes !== "00" && minutes !== "30") {
      return response
        .status(400)
        .json({ message: "Invalid time format, expected HH:00 or HH:30." });
    }

    let flagForSchedule = false;
    let dayInWeek = mapDateToDay(date);
    for (let i = 0; i < clinic._weeklySchedule.length; i++) {
      if (
        doctor._id == clinic._weeklySchedule[i].doctorId &&
        dateBetween(
          time,
          clinic._weeklySchedule[i].start,
          clinic._weeklySchedule[i].end
        ) &&
        dayInWeek == clinic._weeklySchedule[i].day
      ) {
        flagForSchedule = true;
        break;
      }
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
      userId,
      userType,
      _doctorId: doctorId,
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
    const { _doctorId, userId, userType, _date, _time } = request.body;

    const existingAppointment = await appointmentSchema.findById(appointmentId);
    if (!existingAppointment) {
      return response.status(400).json({ message: "Appointment not found." });
    }
    if (!_dooctorId && !userId && !userType && !_date && !_time) {
      return response
        .status(400)
        .json({ message: "No fields to update." });
    }
    

    if (_doctorId) {
      const doctor = await doctorModel.findById(_doctorId);
      if (!doctor) {
        return response.status(400).json({ message: "Doctor not found." });
      }

      if (doctor._clinicId !== existingAppointment._clinicId) {
        return response.status(400).json({
          message: `Doctor ${_doctorId} does not work at clinic ${existingAppointment._clinicId}.`,
        });
      }
    }

    if (userId) {
      const user = await userModel.findById(userId);
      if (!user) {
        return response.status(400).json({ message: "User not found." });
      }
      if (!userType) {
      userType = existingAppointment.userType;
      }
      if (userType === "doctor" && userId === _doctorId) {
        return response
          .status(400)
          .json({ message: "Doctors cannot create appointments with themselves." });
      }
    }


    let updateFields = {};

    if (_doctorId) {
      updateFields["_doctorId"] = _doctorId;
    }
    if (userId) {
      updateFields["userId"] = userId;
    }
    if (userType) {
      updateFields["userType"] = userType;
    }
    if (_date) {
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(_date)) {
        return response.status(400).json({ message: "Invalid date format." });
      }
      updateFields["_date"] = _date;
    }
    if (_time) {
      const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-4]):[0-5][0-9]$/;
      if (!timeRegex.test(_time)) {
        return response.status(400).json({ message: "Invalid time format." });
      }
      updateFields["_time"] = _time;
    }

    let newDate = _date.split("/");
    newDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;

    const appointmentDate = new Date(`${newDate} ${_time}:00`);
    if (appointmentDate < new Date()) {
      return response
        .status(400)
        .json({ message: "Appointment date must be in the future." });
    }

    const validateAppointment = await appointmentSchema.findOne({
      _doctorId: _doctorId || existingAppointment._doctorId,
      _date: _date || existingAppointment._date,
      _time: _time || existingAppointment._time,
    });

    if (validateAppointment && validateAppointment._id != appointmentId) {
      return response
        .status(400)
        .json({ message: "Doctor already has an appointment at that time." });
    }

    const updatedAppointment = await appointmentSchema.findByIdAndUpdate(
      appointmentId,
      updateFields,
      { new: true }
    );
    response.status(200).json({ data: updatedAppointment });
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
    .populate({
      path: "_clinicId",
      select: { _id: 0, _specilization: 1, _contactNumber: 1 },
    })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Appointments Daily Reports
exports.dailyAppointmentsReports = (request, response, next) => {
  let date = new Date();
  let today =
    ("0" + date.getDate()).slice(-2) +
    "/" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    date.getFullYear();
  appointmentSchema
    .find({ _date: today })
    .populate({ path: "userId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_doctorId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({
      path: "_clinicId",
      select: { _id: 0, _specilization: 1, _contactNumber: 1 },
    })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Appointments Range Reports
exports.rangeAppointmentsReports = (request, response, next) => {
  let startDate = new Date(request.params.startDate);
  let endDate = new Date(request.params.endDate);
  appointmentSchema
    .find({
      _id: { $gte: startDate.getTime(), $lte: endDate.getTime() },
    })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

//Patient Appointments Reports
exports.patientAppointmentsReports = (request, response, next) => {
  appointmentSchema
    .find({ _patientId: request.params.id })
    .populate({ path: "userId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_doctorId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({
      path: "_clinicId",
      select: { _id: 0, _specilization: 1, _contactNumber: 1 },
    })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Doctor Appointments Reports
exports.doctorAppointmentsReports = (request, response, next) => {
  appointmentSchema
    .find({ _doctorId: request.params.id })
    .populate({ path: "userId   ", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({ path: "_doctorId", select: { _id: 0, _fname: 1, _lname: 1 } })
    .populate({
      path: "_clinicId",
      select: { _id: 0, _specilization: 1, _contactNumber: 1 },
    })
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
