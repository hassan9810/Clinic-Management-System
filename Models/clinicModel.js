const mongoose = require("mongoose");
const validator = require("mongoose-validator");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const addressSchema = require("./addressModel");

/* validate data using mongoose validator */
const phoneNumberValidator = [
  validator({
    validator: "matches",
    arguments: /^01[0125](\-)?[0-9]{8}$/,
    message:
      "phone number should only contain numbers and match the pattern: 01012345678",
  }),
];
const emailValidator = [
  validator({
    validator: "isEmail",
    message: "Email should be in the format of example@domain.com",
  }),
];
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cost: { type: Number, required: true },
  },
  { _id: false }
);
const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
    },
    start: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        },
        message: "Invalid start date format, should be DD/MM/YYYY",
      },
    },
    end: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
        },
        message: "Invalid end date format, should be DD/MM/YYYY",
      },
    },
    doctorId: {
      type: Number,
      ref: "doctor",
      required: true,
    },
  },
  { _id: false }
);
/* crete schema for clinics collection */
const clinicSchema = new mongoose.Schema({
  _id: { type: Number },
  _contactNumber: {
    type: String,
    required: true,
    validate: phoneNumberValidator,
  },
  _email: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  _address: addressSchema,
  _specilization: {
    type: String,
    required: true,
    enum: [
      "Pediatrics",
      "Women's Health",
      "Cardiology",
      "Neurology",
      "Dental",
      "Physical Therapy",
      "Radiologic",
      "Dermatology",
      "Surgical",
    ],
  },
  _services: [{ type: serviceSchema }],
  _weeklySchedule: [scheduleSchema],
  _doctors: [{ type: Number, unique: true }],
});

/* auto increment for _id field */
clinicSchema.plugin(AutoIncrement, {
  id: "clinic_seq",
  inc_field: "_id",
  start_seq: 1,
});

/* mapping schema bind collection */
module.exports = mongoose.model("clinic", clinicSchema);
