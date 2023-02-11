const mongoose = require("mongoose");
const validator = require("mongoose-validator");
const addressSchema = require("./addressModel");

/* validate data using mongoose validator */
const nameValidator = [
  validator({
    validator: "isLength",
    arguments: [3, 10],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
  validator({
    validator: "matches",
    arguments: /^[a-zA-Z\s]+$/,
    message: "Name should only contain letters and spaces",
  }),
];

const emailValidator = [
  validator({
    validator: "isEmail",
    message: "Email should be in the format of example@domain.com",
  }),
];

const phoneNumberValidator = [
  validator({
    validator: "matches",
    arguments: /^01[0125](\-)?[0-9]{8}$/,
    message:
      "phone number should only contain numbers and match the pattern: 01012345678",
  }),
];

function dateOfBirthValidator(value) {
  let now = new Date();
  let age = now.getFullYear() - value.split("/")[2];
  if (now.getMonth() < value.split("/")[1]) {
    age--;
  }
  return (
    age >= 18 &&
    age <= 60 &&
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
      value
    )
  );
}

const personSchema = new mongoose.Schema(
  {
    _fname: { type: String, required: true, validate: nameValidator },
    _lname: { type: String, required: true, validate: nameValidator },
    _dateOfBirth: {
      type: String,
      required: true,
      validate: [
        dateOfBirthValidator,
        "Age must be at least 18 and at most 60",
      ],
      set: function (value) {
        let date = new Date(value);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    _age: {
      type: Number,
      required: true,
      minValue: 18,
      maxValue: 60,
    },
    _gender: { type: String, required: true },
    _contactNumber: {
      type: String,
      required: true,
      validate: phoneNumberValidator,
    },
    _email: {
      type: String,
      required: true,
      validate: emailValidator,
      unique: [true, "This email is already in use"],
    },
    _address: addressSchema,
    _password: { type: String, required: true },
    _image: { type: String, required: true, default: "images\\default.jpeg" },
  },
  { _id: false }
);
module.exports = personSchema;
