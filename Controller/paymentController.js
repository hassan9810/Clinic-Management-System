const stripe = require("stripe")(process.env.SECRET_KEY_STRIPE);
const invoiceSchema = require("./../Models/invoiceModel");
const patientSchema = require("./../Models/patientModel");
const paymentSchema = require("./../Models/paymentModel");

// Add a new payment
exports.addPayment = async (request, response, next) => {
  const invoice_id = request.params.id;

  let invoice = await invoiceSchema.findOne({ _id: invoice_id });
  if (!invoice) {
    return response.status(404).send({ error: "Invoice not found" });
  }
  let amount = request.body.amount;
  if (amount > invoice.totalDue) {
    return response.status(400).send("Amount paid exceeds total due");
  }

  let patientData = await patientSchema.findOne({ _id: invoice.patient_Id });
  const card_number = request.body.card_number;
  const exp_month = request.body.exp_month;
  const exp_year = request.body.exp_year;
  const cvc = request.body.cvc;

  const param = {};
  param.card = {
    number: card_number,
    exp_month,
    exp_year,
    cvc,
  };

  try {
    const token = await stripe.tokens.create(param);
    const customer = await stripe.customers.create({
      metadata: {
        card_number,
        exp_month,
        exp_year,
        cvc,
      },
      email: patientData._email,
      source: token.id,
      name: `${patientData._firstName} ${patientData._lastName}`,
      address: {
        line1: patientData._address.street,
        postal_code: patientData._address.zipCode,
        city: patientData._address.city,
        state: patientData._address.city,
        country: patientData._address.country,
      },
    });
    await stripe.charges.create({
      amount: amount * 100,
      description: "clinic service",
      currency: "USD",
      customer: customer.id,
    });
    invoice.paid += amount;
    invoice.totalDue = invoice.total - invoice.paid;
    invoice.status = invoice.paid === invoice.total ? "paid" : "partial";
    invoice.paymentMethod = "credit";
    await invoice.save();

    const invoiceIndex = patientData.invoices.findIndex(
      (i) => i.invoice_id === invoice_id
    );
    patientData.invoices[invoiceIndex].totalDue = invoice.totalDue;
    patientData.invoices[invoiceIndex].status = invoice.status;
    await patientData.save();

    let newPayment = paymentSchema({
      invoice_id: invoice_id,
      amount: amount,
      card_number: card_number,
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: cvc,
      email: patientData._email,
    });

    await newPayment.save();
    response.send({ message: "Payment added successfully" });
  } catch (error) {
    response.status(500).send({ error: error });
  }
};
