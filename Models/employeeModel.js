const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const personSchema = require("./personModel");


const invoicesSchema = new mongoose.Schema({
  invoice_id: { type: String },
  total: { type: Number },
  totalDue: { type: Number },
  status: { type: String },
},  { _id: false });


/*** crete schema for employees collection ***/
const employeeSchema = new mongoose.Schema(
  Object.assign({}, personSchema.obj, {
    _id: { type: Number },
    _clinic: { type: Number, ref: "clinic" },
    _monthlyRate: { type: Number },
    _workingHours: { type: Number, min: 0, max: 24 },
    _role: { type: String, required: true, enum: ['receptionist', 'nurse'] },
    _medicalHistory: { type: String },
    invoices: [invoicesSchema]
  })
);

/*** auto increment for _id field ***/
employeeSchema.plugin(AutoIncrement, {
  id: "employee_seq",
  inc_field: "_id",
  start_seq: 1000,
});

/*** mapping schema bind collection  ***/
module.exports = mongoose.model("employee", employeeSchema);
