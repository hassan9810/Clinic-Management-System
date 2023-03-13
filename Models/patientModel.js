const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const personSchema = require("./personModel");
// const invoicesSchema = require("./invoiceModel");

const invoicesSchema = new mongoose.Schema({
    invoice_id: { type: String },
    total: { type: Number },
    totalDue: { type: Number },
    status: { type: String },
},  { _id: false });
  

/*** crete schema for patients collection ***/
const patientSchema = new mongoose.Schema(
  Object.assign({}, personSchema.obj, {
    _medicalHistory: { type: String },
    _id: { type: Number },
    invoices: [invoicesSchema],
  })
);

/*** auto increment for _id field ***/
patientSchema.plugin(AutoIncrement, {
  id: "patient_seq",
  inc_field: "_id",
  start_seq: 10000,
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("patient", patientSchema);
