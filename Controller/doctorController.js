/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const doctorSchema = require("../Models/doctorModel");
const clinicSchema = require("../Models/clinicModel");
const users = require("../Models/usersModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
  mapSpecilityToSpecilization,
} = require("../helper/helperfns");

// Create a new doctor
exports.getAllDoctors = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let doctors = await filterData(doctorSchema, query, [
      {
        path: "_clinic",
        options: { strictPopulate: false },
        select: { _specilization: 1, _address: 1, _id: 0 },
      },
    ]);
    doctors = sortData(doctors, query);
    doctors = paginateData(doctors, request.query);
    doctors = sliceData(doctors, request.query);
    response.status(200).json({ doctors });
  } catch (error) {
    next(error);
  }
};
// Edit a doctor
exports.addDoctor = async (request, response, next) => {
  try {
    let doctorSpecilatyToClinicSpecilization = mapSpecilityToSpecilization(
      request.body.speciality
    );
    const existingClinics = await clinicSchema.find(
      { _specilization: doctorSpecilatyToClinicSpecilization },
      { _id: 1, _specilization: 1, _weeklySchedule: 1, _doctors: 1 }
    );
    if (existingClinics.length == 0)
      return response.status(400).json({
        message: `Sorry, We don't have a department for ${request.body.speciality} yet`,
      });
    let acceptedClinic;
    for (let i = 0; i < existingClinics.length; i++) {
      if (existingClinics[i]._doctors.length < 10) {
        acceptedClinic = existingClinics[i];
        break;
      }
    }
    if (!acceptedClinic) {
      return response.status(400).json({
        message: `Sorry, No available clinic for this doctor to be added`,
      });
    }
    let testNameOfDoctor = await doctorSchema.find({
      _fname: request.body.firstname,
      _lname: request.body.lastname,
    });
    if (testNameOfDoctor != 0) {
      return response.status(400).json({
        message: `There already a doctor with such name`,
      });
    }
    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone) {
      if (testEmailandPhone._email == request.body.email) {
        return response.status(400).json({ message: `Email Already in use` });
      } else if (testEmailandPhone._contactNumber == request.body.phone) {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      }
    }
    const hash = await bcrypt.hash(request.body.password, 10);
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
      age--;
    }
    let sentObject = {
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _dateOfBirth: request.body.dateOfBirth,
      _age: age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _specilization: request.body.speciality,
      _clinic: acceptedClinic._id,
      _schedule: request.body.schedule,
    };
    if (request.file) {
      sentObject._image = request.file.path;
    }
    const doctor = new doctorSchema(sentObject);
    let savedDoctor = await doctor.save();

    let DoctorIdIntoSchedule = request.body.schedule.map((element) => {
      return { doctorId: savedDoctor._id, ...element };
    });

    await clinicSchema.updateOne(
      { _id: acceptedClinic._id },
      {
        $push: {
          _weeklySchedule: DoctorIdIntoSchedule,
          _doctors: savedDoctor._id,
        },
      }
    );

    const newUser = new users({
      _idInSchema: savedDoctor._id,
      _role: "doctor",
      _email: request.body.email,
      _contactNumber: request.body.phone,
      _password: hash,
    });

    await newUser.save();
    response
      .status(201)
      .json({ message: "Doctor created successfully.", doctor });
  } catch (error) {
    next(error);
  }
};
// Full Edit a doctor
exports.putDoctorById = async (request, response, next) => {
  try {
    let foundDoctor = await doctorSchema.findOne({ _id: request.params.id });
    if (!foundDoctor)
      response.status(200).json({ message: "Doctor not found" });

    let tryFirstandLastName = await doctorSchema.findOne({
      _fname: request.body.firstname,
      _lname: request.body.lastname,
    });
    if (tryFirstandLastName)
      return response.status(400).json({
        message: `There already a doctor with such name`,
      });

    let testEmailandPhone = await users.findOne({
      $or: [
        { _email: request.body.email },
        { _contactNumber: request.body.phone },
      ],
    });
    if (testEmailandPhone) {
      if (testEmailandPhone._email == request.body.email) {
        return response.status(400).json({ message: `Email Already in use` });
      } else if (testEmailandPhone._contactNumber == request.body.phone) {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      }
    }
    let doctorSpecilatyToClinicSpecilization = mapSpecilityToSpecilization(
      request.body.speciality
    );
    const existingClinics = await clinicSchema.find(
      { _specilization: doctorSpecilatyToClinicSpecilization },
      { _id: 1, _specilization: 1, _weeklySchedule: 1, _doctors: 1 }
    );
    if (existingClinics.length == 0)
      return response.status(400).json({
        message: `Sorry, We don't have a department for ${request.body.speciality} yet`,
      });
    let acceptedClinic;
    for (var i = 0; i < existingClinics.length; i++) {
      if (existingClinics[i]._doctors.length < 10) {
        acceptedClinic = existingClinics[i];
        break;
      }
    }
    if (!acceptedClinic) {
      return response.status(400).json({
        message: `Sorry, No available clinic for this doctor to be added`,
      });
    }

    const hash = await bcrypt.hash(request.body.password, 10);
    let now = new Date();
    let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
    if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
      age--;
    }
    let sentObject = {
      _fname: request.body.firstname,
      _lname: request.body.lastname,
      _dateOfBirth: request.body.dateOfBirth,
      _age: age,
      _gender: request.body.gender,
      _contactNumber: request.body.phone,
      _email: request.body.email,
      _address: request.body.address,
      _password: hash,
      _specilization: request.body.speciality,
      _clinic: acceptedClinic._id,
      _schedule: request.body.schedule,
    };
    if (request.file) {
      sentObject._image = request.file.path;
    }

    await doctorSchema.updateOne(
      { _id: request.params.id },
      {
        $set: sentObject,
      }
    );

    let DoctorIdIntoSchedule = request.body.schedule.map((element) => {
      return { doctorId: +request.params.id, ...element };
    });
    await clinicSchema.updateOne(
      { _doctors: request.params.id },
      {
        $pull: {
          _weeklySchedule: { doctorId: request.params.id },
        },
      }
    );
    await clinicSchema.updateOne(
      { _doctors: request.params.id },
      { $push: { _weeklySchedule: DoctorIdIntoSchedule } }
    );

    await users.updateOne(
      { _idInSchema: request.params.id },
      {
        $set: {
          _email: request.body.email,
          _contactNumber: request.body.phone,
        },
      }
    );

    response
      .status(200)
      .json({ status: "Doctor updated successfully", sentObject });
  } catch (error) {
    next(error);
  }
};
// Get all doctors
exports.patchDoctorById = async (request, response, next) => {
  try {
    let foundDoctor = await doctorSchema.findOne({ _id: request.params.id });
    if (!foundDoctor)
      return response.status(200).json({ message: "Doctor not found." });
    let tempDoctor = {};
    if (request.body.firstname) {
      tempDoctor._fname = request.body.firstname;
    }
    if (request.body.lastname) {
      tempDoctor._lname = request.body.lastname;
    }
    if (request.body.password) {
      const hash = await bcrypt.hash(request.body.password, 10);
      tempDoctor._password = hash;
    }
    if (request.body.address) {
      if (
        request.body.address.street ||
        request.body.address.city ||
        request.body.address.country ||
        request.body.address.zipCode
      ) {
        if (request.body.address.street)
          tempDoctor["_address.street"] = request.body.address.street;
        if (request.body.address.city)
          tempDoctor["_address.city"] = request.body.address.city;
        if (request.body.address.country)
          tempDoctor["_address.country"] = request.body.address.country;
        if (request.body.address.zipCode)
          tempDoctor["_address.zipCode"] = request.body.address.zipCode;
      } else {
        return response.status(200).json({ message: `Address can't be empty` });
      }
    }
    if (request.body.gender) {
      tempDoctor._gender = request.body.gender;
    }
    if (request.body.dateOfBirth) {
      tempDoctor._dateOfBirth = request.body.dateOfBirth;
      let now = new Date();
      let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
      if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
        age--;
      }
      tempDoctor._age = age;
    }
    if (request.file) {
      tempDoctor._image = request.file.path;
    }
    if (request.body.phone) {
      tempDoctor._contactNumber = request.body.phone;
    }
    if (request.body.email) {
      tempDoctor._email = request.body.email;
    }
    if (request.body.schedule) {
      tempDoctor._schedule = request.body.schedule;
    }
    //check firstname / lastname
    if (request.body.firstname && request.body.lastname) {
      let tryFirstandLastName = await doctorSchema.findOne({
        _fname: request.body.firstname,
        _lname: request.body.lastname,
      });
      if (tryFirstandLastName)
        return response.status(400).json({
          message: `There already a doctor with such name`,
        });
    } else if (request.body.firstname) {
      let tryFirstName = await doctorSchema.find({
        _fname: request.body.firstname,
      });
      if (tryFirstName.length > 0)
        return response.status(400).json({
          message: `There already a doctor with such name`,
        });
    } else if (request.body.lastname) {
      let tryLastName = await doctorSchema.find({
        _lname: request.body.lastname,
      });
      if (tryLastName.length > 0)
        return response.status(400).json({
          message: `There already a doctor with such name`,
        });
    }
    //_____UPDATES_____//
    //check duplicate email/phone & update usermodel => last
    if (request.body.phone && request.body.email) {
      let testEmailandPhone = await users.findOne({
        $or: [
          { _email: request.body.email },
          { _contactNumber: request.body.phone },
        ],
      });
      if (testEmailandPhone) {
        if (testEmailandPhone._email == request.body.email) {
          return response.status(400).json({ message: `Email Already in use` });
        } else if (testEmailandPhone._contactNumber == request.body.phone) {
          return response
            .status(400)
            .json({ message: `Phone number Already in use` });
        }
      } else {
        await users.updateOne(
          { _idInSchema: request.params.id },
          {
            $set: {
              _email: request.body.email,
              _contactNumber: request.body.phone,
            },
          }
        );
      }
    } else if (request.body.phone) {
      let testPhone = await users.findOne({
        _contactNumber: request.body.phone,
      });
      if (testPhone) {
        return response
          .status(400)
          .json({ message: `Phone number Already in use` });
      } else {
        await users.updateOne(
          { _idInSchema: request.params.id },
          { $set: { _contactNumber: request.body.phone } }
        );
      }
    } else if (request.body.email) {
      let testEmail = await users.findOne({
        _email: request.body.email,
      });
      if (testEmail) {
        return response.status(400).json({ message: `Email Already in use` });
      } else {
        await users.updateOne(
          { _idInSchema: request.params.id },
          { $set: { _email: request.body.email } }
        );
      }
    }
    //update schedule
    if (request.body.schedule) {
      let DoctorIdIntoSchedule = request.body.schedule.map((element) => {
        return { doctorId: +request.params.id, ...element };
      });
      await clinicSchema.updateOne(
        { _doctors: request.params.id },
        {
          $pull: {
            _weeklySchedule: { doctorId: request.params.id },
          },
        }
      );
      await clinicSchema.updateOne(
        { _doctors: request.params.id },
        { $push: { _weeklySchedule: DoctorIdIntoSchedule } }
      );
      await doctorSchema.updateOne(
        { _id: request.params.id },
        { $set: tempDoctor }
      );
    }

    response
      .status(200)
      .json({ message: "Doctor updated successfully.", tempDoctor });
  } catch (error) {
    next(error);
  }
};
// Get a doctor by ID
exports.getDoctorById = async (request, response, next) => {
  try {
    let doctor = await doctorSchema.find({ _id: request.params.id }).populate({
      path: "_clinic",
      options: { strictPopulate: false },
      select: { _specilization: 1, _address: 1, _id: 0 },
    });
    if (!doctor) {
      return next(new Error("doctor not found"));
    }
    response.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};
// Remove a doctor
exports.removeDoctorById = async (request, response, next) => {
  try {
    const doctor = await doctorSchema.findOneAndDelete({
      _id: request.params.id,
    });
    if (!doctor) return response.status(200).json("Doctor not found");
    await users.deleteOne({ _idInSchema: request.params.id });
    await clinicSchema.updateOne(
      { _id: doctor._clinic },
      {
        $pull: {
          _doctors: request.params.id,
          _weeklySchedule: { doctorId: request.params.id },
        },
      }
    );
    response
      .status(200)
      .json({ message: "Doctor removed successfully.", doctor });
  } catch (error) {
    next(error);
  }
};

const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id: "_id",
    firstname: "_fname",
    lastname: "_lname",
    dateOfBirth: "_dateOfBirth",
    age: "_age",
    gender: "_gender",
    phone: "_contactNumber",
    email: "_email",
    address: "_address",
    profileImage: "_image",
    speciality: "_specilization",
    clinic: "_clinics",
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
