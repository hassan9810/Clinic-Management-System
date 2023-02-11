const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);



const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    additionalCosts: { type: Number, required: true, default: 0 },
    notes: { type: String, required: false, default: ""}
  },
  { _id: false }
);



/*** crete schema for invoices collection ***/
const invoiceSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  patient_Id: { type: Number, required: true, ref: "patient" },
  clinic_Id: { type: Number, required: true, ref: "clinic" },
  services: [serviceSchema],
  total: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true,
    default: (new Date()).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "credit", "insurance"],
    required: true,
    default: "cash"
  },
  paid: {
    type: Number,
    required: true,
    default: 0
  },
  totalDue: {
    type: Number,
    required: true,
    default: function() {
      return this.total - this.paid;
    }
  },
  status: {
    type: String,
    required: false,
    default: "unpaid",
    enum: ["paid", "unpaid", "partial"]
    },   
});


/*** mapping schema bind collection  ***/
module.exports = mongoose.model("invoice", invoiceSchema);
