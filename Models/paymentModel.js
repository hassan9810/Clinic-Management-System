const mongoose = require("mongoose");
const validator = require("mongoose-validator");


const emailValidator = [
  validator({
    validator: "isEmail",
    message: "Email should be in the format of example@domain.com",
  }),
];


const paymentSchema = new mongoose.Schema({
  invoice_id: {
    type: String,
    ref: "invoice",
    required: [true, "Invoice id is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  card_number: {
    type: String,
    required: [true, "Card number is required"],
  },
  exp_month: {
    type: Number,
    required: [true, "Expiration month is required"],
  },
  exp_year: {
    type: Number,
    required: [true, "Expiration year is required"],
  },
  cvc: {
    type: Number,
    required: [true, "CVC is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: emailValidator,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model("payment", paymentSchema);

module.exports = Payment;
