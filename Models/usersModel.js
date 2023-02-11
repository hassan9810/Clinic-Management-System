const mongoose = require("mongoose");
const validator = require("mongoose-validator");
const phoneNumberValidator = [
  validator({
    validator: "matches",
    arguments: /^01[0125](\-)?[0-9]{8}$/,
    message:
      "phone number should only contain numbers and match the pattern: 01012345678",
  }),
];
/*** crete schema for users collection ***/
const userSchema = new mongoose.Schema({
  _idInSchema: Number,
  _role: {
    type: String,
    enum: ["admin", "patient", "doctor", "employee"],
    required: true,
  },
  _email: {
    type: String,
    required: true,
    unique: true,
  },
  _contactNumber: {
    type: String,
    required: true,
    validate: phoneNumberValidator,
    unique: true,
  },
  _forClinic: {
    type: Number,
    default: 0,
  },
  _password: { type: String, required: true },
});

module.exports = mongoose.model("user", userSchema);
