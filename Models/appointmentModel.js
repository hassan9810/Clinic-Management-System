const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new Date().getTime().toString(),
  },
  _clinicId: {
    type: Number,
    ref: "clinic",
    required: true,
  },
  _patientId: {
    type: Number,
    ref: "patient",
    required: true,
  },
  _doctorId: {
    type: Number,
    ref: "doctor",
    required: true,
  },
  _date: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
          value
        );
      },
      message: "Invalid date format, should be DD/MM/YYYY",
    },
  },
  _time: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^([0-9]|0[0-9]|1[0-9]|2[0-4]):[0-5][0-9]$/.test(value);
      },
      message: "Invalid time format, should be in the form 00:00 ",
    },
  },
  _status: {
    type: String,
    required: true,
    default: "Pending",
    enum: ["Pending", "Accepted", "Declined", "Completed"],
  }
});

module.exports = mongoose.model("appointment", appointmentSchema);
