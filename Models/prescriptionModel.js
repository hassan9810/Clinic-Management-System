const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);



const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dose: { type: String, required: true },
    frequency: { type: String, required: true },
    type: { type: String, required: true, enum: ['syrup', 'tablet', 'capsule'] }
  }, { _id: false }
);


const prescriptionSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  clinicRef: {
    type: Number,
    required: [true, "Clinic is required"],
    ref: "clinic",
  },

  patientRef: {
    type: Number,
    required: [true, "Patient is required"],
    ref: "patient",
  },

  doctorRef: {
    type: Number,
    required: [true, "Doctor is required"],
    ref: "doctor",
  },

  medications: [medicineSchema],
  instructions: { type: String, required: false },
  date: {
    type: String, required: true, default: (new Date()).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  },
});

prescriptionSchema.plugin(AutoIncrement, {
  id: "prescription_seq",
  inc_field: "_id",
  start_seq: 20000,
});
module.exports = mongoose.model("prescription", prescriptionSchema);
