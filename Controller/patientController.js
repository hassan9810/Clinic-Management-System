/* require bcrypt */
const bcrypt = require("bcrypt");

/* require all needed modules */
const patientSchema = require("../Models/patientModel");
const users = require("../Models/usersModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

//get all patients
exports.getAllPatients = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let patients = await filterData(patientSchema, query);
    patients = sortData(patients, query);
    patients = paginateData(patients, request.query);
    patients = sliceData(patients, request.query);

    response.status(200).json({ patients });
  } catch (error) {
    next(error);
  }
};

// Add a new patient
exports.addPatient = async (request, response, next) => {
  try {
    // check for duplicate mails and phone numbers
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
      _medicalHistory: request.body.medicalHistory,
    };
    if (request.file) {
      sentObject._image = request.file.path;
    }
    const savedPatient = new patientSchema(sentObject);
    await savedPatient.save();
    const newUser = new users({
      _idInSchema: savedPatient._id,
      _role: "patient",
      _email: request.body.email,
      _contactNumber: request.body.phone,
      _password: hash,
    });
    await newUser.save();
    response
      .status(201)
      .json({ message: "Patient created successfully.", savedPatient });
  } catch (error) {next(error);}
};

// Put a patient
exports.putPatientById = async (request, response, next) => {
  try {
    let patientExists = await patientSchema.find({ _id: request.body.clinic });
    if (!patientExists)
      return response
        .status(400)
        .json({ message: `Patient ${request.body.id} not found` });
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
      _medicalHistory: request.body.medicalHistory,
    };
    if (request.file) {
      sentObject._image = request.file.path;
    }
    await users.updateOne(
      { _idInSchema: request.params.id },
      {
        $set: {
          _email: request.body.email,
          _contactNumber: request.body.phone,
        },
      }
    );
    const updatedPatient = await patientSchema.updateOne(
      { _id: request.params.id },
      {
        $set: sentObject,
      }
    );
    response
      .status(200)
      .json({ message: "Patient updated successfully.", updatedPatient });
  } catch (error) {
    next(error);
  }
};

// Patch a patient
exports.patchPatientById = async (request, response, next) => {
  try {
    let foundPatient = await patientSchema.findOne({ _id: request.params.id });
    if (!foundPatient)
      return response.status(200).json({ message: "Patient not found." });
    let tempPatient = {};
    if (request.body.firstname) {
      tempPatient._fname = request.body.firstname;
    }
    if (request.body.lastname) {
      tempPatient._lname = request.body.lastname;
    }
    if (request.body.medicalHistory) {
      tempPatient._medicalHistory = request.body.medicalHistory;
    }
    if (request.body.password) {
      const hash = await bcrypt.hash(request.body.password, 10);
      tempPatient._password = hash;
    }
    if (request.file) {
      tempPatient._image = request.file.path;
    }
    if (request.body.address) {
      if (
        request.body.address.street ||
        request.body.address.city ||
        request.body.address.country ||
        request.body.address.zipCode
      ) {
        if (request.body.address.street)
          tempPatient["_address.street"] = request.body.address.street;
        if (request.body.address.city)
          tempPatient["_address.city"] = request.body.address.city;
        if (request.body.address.country)
          tempPatient["_address.country"] = request.body.address.country;
        if (request.body.address.zipCode)
          tempPatient["_address.zipCode"] = request.body.address.zipCode;
      } else {
        return response.status(200).json({ message: `Address can't be empty` });
      }
    }
    if (request.body.gender) {
      tempPatient._gender = request.body.gender;
    }
    if (request.body.dateOfBirth) {
      tempPatient._dateOfBirth = request.body.dateOfBirth;
      let now = new Date();
      let age = now.getFullYear() - request.body.dateOfBirth.split("/")[2];
      if (now.getMonth() < request.body.dateOfBirth.split("/")[1]) {
        age--;
      }
      tempPatient._age = age;
    }
    if (request.body.phone) {
      tempPatient._contactNumber = request.body.phone;
    }
    if (request.body.email) {
      tempPatient._email = request.body.email;
    }
    //check firstname / lastname
    if (request.body.firstname && request.body.lastname) {
      let tryFirstandLastName = await patientSchema.findOne({
        _fname: request.body.firstname,
        _lname: request.body.lastname,
      });
      if (tryFirstandLastName)
        return response.status(400).json({
          message: `There already a doctor with such name`,
        });
    } else if (request.body.firstname) {
      let tryFirstName = await patientSchema.find({
        _fname: request.body.firstname,
      });
      if (tryFirstName.length > 0)
        return response.status(400).json({
          message: `There already a doctor with such name`,
        });
    } else if (request.body.lastname) {
      let tryLastName = await patientSchema.find({
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

    await patientSchema.updateOne(
      { _id: request.params.id },
      { $set: tempPatient }
    );

    response
      .status(200)
      .json({ message: "Patient updated successfully.", tempPatient });
  } catch (error) {
    next(error);
  }
};

// Remove a patient
exports.removePatientById = async (request, response, next) => {
  try {
    const patient = await patientSchema.findByIdAndDelete(
      request.params.id || request.body.id
    );
    if (!patient) {
      return next(new Error("patient not found"));
    }
    response
      .status(201)
      .json({ message: "Patient removed successfully.", patient });
  } catch (error) {
    next(error);
  }
};

// Get a patient by ID
exports.getPatientById = async (request, response, next) => {
  try {
    const patient = await patientSchema.findOne({
      _id: request.params.id,
    });
    if (!patient) {
      return next(new Error("patient not found"));
    }
    response.status(200).json(patient);
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
    medicalHistory: "_medicalHistory",
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
