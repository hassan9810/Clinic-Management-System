const mongoose = require("mongoose");
const validator = require("mongoose-validator");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const nameValidator = [
  validator({
    validator: "isLength",
    arguments: [3, 50],
    message: "Name should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
  validator({
    validator: "matches",
    arguments: /^[a-zA-Z\s]+$/,
    message: "Name should only contain letters and spaces",
  }),
];
/*** crete schema for patients collection ***/
const medicineSchema = new mongoose.Schema({
  _id: Number,
  _name: {
    type: String,
    required: true,
    validate: nameValidator,
    unique: true,
  },
  _productionDate: { type: String, required: true },
  _expiryDate: { type: String, required: true },
  _leaflet: { type: String, required: true },
  _pricePerUnit: { type: Number, required: true },
  _quantity: { type: Number, required: true },
});

/*** auto increment for _id field ***/
medicineSchema.plugin(AutoIncrement, {
  id: "medicine_seq",
  inc_field: "_id",
  start_seq: 100000,
});

module.exports = mongoose.model("medicine", medicineSchema);
