/*** callback fns for CRUD operations ***/

/* require needed library to genrate invoice */
const fs = require("fs");
const easyinvoice = require("easyinvoice");

/* require all needed modules */
const invoiceSchema = require("../Models/invoiceModel");
const patientSchema = require("../Models/patientModel");
const clinicSchema = require("../Models/clinicModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

//get all invoices
exports.getInvoices = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let invoice = await filterData(invoiceSchema, query, [
      { path: "patient_Id", options: { strictPopulate: false }, select: { _email: 1, _fname: 1, _lname: 1 } },
      { path: "clinic_Id", options: { strictPopulate: false }, select: { _specilization: 1 } },
    ]);
    invoice = sortData(invoice, query);
    invoice = paginateData(invoice, request.query);
    invoice = sliceData(invoice, request.query);
    response.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};



const generateInvoiceId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  const invoiceId = `${year}-${day}${month}-${random}`;
  return invoiceId;
};

// Add a new invoice
exports.addInvoice = async (request, response, next) => {
  try {
    const clinic = await clinicSchema.findOne({ _id: request.body.clinicId });
    if (!clinic)
      return response.status(400).json({ error: "Clinic not found" });

    let patient = await patientSchema.findOne({
      _id: request.body.patientId,
    });
    if (!patient)
      return response.status(400).json({ error: "Patient not found" });
    let services = request.body.services;
    let totalCost = 0;
    let invoiceServices = [];

    for (let i = 0; i < services.length; i++) {
      let clinicService = clinic._services.find((service) => service.name === services[i].name);
      if (!clinicService) return response.status(400).json({ error: `Service ${services[i].name} not found in clinic ${request.body.clinicId}` });

      totalCost += clinicService.cost + services[i].additionalCosts;
      let invoiceServicesobject = { "name": clinicService.name, "cost": clinicService.cost + services[i].additionalCosts };
      invoiceServices.push(invoiceServicesobject);
    }
    let paymentMethod = "cash";
    if (request.body.paymentMethod) {
      paymentMethod = request.body.paymentMethod;
      if (paymentMethod !== "cash" && paymentMethod !== "credit card" && paymentMethod !== "insurance") {
        return response.status(400).json({ error: "Payment method not accepted" });
      }
    }
    let paid = 0;
    let totalDue = totalCost;
    let invoiceStatus = "unpaid";
    if (request.body.paid) {
      paid = request.body.paid;
      if (paid > totalCost) {
        return response.status(400).json({ error: "Paid amount is greater than total cost" });
      }
      else if (paid === totalCost) {
        invoiceStatus = "paid";
        totalDue = 0;
      } else {
        invoiceStatus = "partial";
        totalDue = totalCost - paid;
      }
    }

    let addedInvoice = invoiceSchema({
      _id: generateInvoiceId(),
      patient_Id: request.body.patientId,
      clinic_Id: request.body.clinicId,
      services: services,
      total: totalCost,
      paymentMethod: paymentMethod,
      paid: paid,
      totalDue: totalDue,
      status: invoiceStatus,
    });
    await addedInvoice.save();

    patient.invoices.push({
      invoice_id: addedInvoice._id,
      total: addedInvoice.total,
      totalDue: addedInvoice.totalDue,
      status: addedInvoice.status,
    });
    await patient.save();


    const date = new Date();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    let data = {
      currency: "USD",
      taxNotation: "vat",
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      settings: { locale: "en-US", currency: "USD" },
      sender: {
        company: `Alwafaa-${clinic._specilization}-${clinic._id}`,
        address: clinic._address.street,
        zip: clinic._address.zipCode,
        city: clinic._address.city,
        country: clinic._address.country,
      },
      client: {
        company: patient._fname + " " + patient._lname,
        address: patient._address.street,
        zip: patient._address.zipCode,
        city: patient._address.city,
        country: patient._address.country,
      },
      images: {
        logo: "https://seeklogo.com/images/H/hospital-clinic-plus-logo-7916383C7A-seeklogo.com.png",
      },

      information: {
        number: addedInvoice._id,
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        "due-date": `${dueDate.getDate()}/${dueDate.getMonth() + 1
          }/${dueDate.getFullYear()}`,
      },
      products: invoiceServices.map((service) => ({
        quantity: "1",
        description: service.name,
        "tax-rate": 14,
        price: service.cost,
      })),
      "bottom-notice": "Kindly pay your invoice within 30 days.",
    };

    const invoicePdf = async () => {
      let result = await easyinvoice.createInvoice(data);
      fs.writeFile(
        `invoices/${addedInvoice._id}.pdf`,
        result.pdf,
        "base64",
        function (error) {
          if (error) {
            next(error);
          }
        }
      );
    };
    await invoicePdf();
    response.status(200).json({
      status: "Invoice Added and Saved to File",
      invoice: addedInvoice,
    });
  } catch (error) {
    next(error);
  }
};

// Edit a invoice
exports.editInvoice = async (request, response, next) => {
  try {
    const existingInvoice = await invoiceSchema.findById(request.params.id);
    let clinic, patient;
    if (!existingInvoice) {
      return response.status(400).json({ message: "Invoice not found." });
    }

    let paymentMethod = existingInvoice.paymentMethod;
    if (request.body.paymentMethod) {
      paymentMethod = request.body.paymentMethod;
      if (paymentMethod !== "cash" && paymentMethod !== "credit card" && paymentMethod !== "insurance") {
        return response.status(400).json({ error: "Payment method not accepted" });
      }
    }
    let { clinicId, patientId, services } = request.body;
    let total = existingInvoice.total;
    let paid = existingInvoice.paid;
    let totalDue = existingInvoice.totalDue;
    let invoiceStatus = existingInvoice.status;

    if (clinicId) {
      clinic = await clinicSchema.findById(clinicId);
      if (!clinic) {
        return response.status(400).json({ message: "Clinic not found." });
      }
    } else {
      clinicId = existingInvoice.clinic_Id;
      clinic = await clinicSchema.findById(clinicId);
    }

    if (patientId) {
      patient = await patientSchema.findById(patientId);
      if (!patient) {
        return response.status(400).json({ message: "Patient not found." });
      }
    } else {
      patientId = existingInvoice.patient_Id;
    }
    let invoiceServices = [];
    if (!services) {
      services = existingInvoice.services;
    }
    for (let i = 0; i < services.length; i++) {
      let clinicService = clinic._services.find((service) => service.name === services[i].name);
      if (!clinicService) return response.status(400).json({ error: `Service ${services[i].name} not found in clinic ${request.body.clinicId}` });
      let invoiceServicesobject = { "name": clinicService.name, "cost": clinicService.cost + services[i].additionalCosts };
      invoiceServices.push(invoiceServicesobject);
    }

    if (request.body.paid) {
      paid = request.body.paid;
      if (paid > total) {
        return response.status(400).json({ error: "Paid amount is greater than total" });
      }
      else if (paid === total) {
        invoiceStatus = "paid";
        totalDue = 0;
      } else {
        invoiceStatus = "partial";
        totalDue = total - paid;
      }
    }


    let tempInvoice = {
      clinic_Id: clinicId,
      patient_Id: patientId,
      services: services,
      total: total,
      paymentMethod: paymentMethod,
      paid: paid,
      totalDue: totalDue,
      status: invoiceStatus,
    };

    const updatedInvoice = await invoiceSchema.updateOne(
      { _id: request.params.id },
      { $set: tempInvoice }
    );

    if (!patient) {
      patient = await patientSchema.findOne({ _id: patientId });
    }
    const updatedInvoiceIndex = patient.invoices.findIndex((invoice) => invoice.invoice_id === existingInvoice._id);
    patient.invoices[updatedInvoiceIndex].total = existingInvoice.total;
    patient.invoices[updatedInvoiceIndex].totalDue = existingInvoice.totalDue;
    patient.invoices[updatedInvoiceIndex].status = existingInvoice.status;
    await patient.save();

    if (!clinic) {
      clinic = await clinicSchema.findById(clinicId);
    }

    const date = new Date();
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    fs.unlinkSync(`invoices/${existingInvoice._id}.pdf`);

    let data = {
      currency: "USD",
      taxNotation: "vat",
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      settings: { locale: "en-US", currency: "USD" },
      sender: {
        company: `Alwafaa-${clinic._specilization}-${clinic._id}`,
        address: clinic._address.street,
        zip: clinic._address.zipCode,
        city: clinic._address.city,
        country: clinic._address.country,
      },
      client: {
        company: patient._fname + " " + patient._lname,
        address: patient._address.street,
        zip: patient._address.zipCode,
        city: patient._address.city,
        country: patient._address.country,
      },

      images: {
        logo: "https://seeklogo.com/images/H/hospital-clinic-plus-logo-7916383C7A-seeklogo.com.png",
      },

      information: {
        number: existingInvoice._id,
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        "due-date": `${dueDate.getDate()}/${dueDate.getMonth() + 1
          }/${dueDate.getFullYear()}`,
      },
      products: invoiceServices.map((service) => ({
        quantity: "1",
        description: service.name,
        "tax-rate": 14,
        price: service.cost,
      })),
      "bottom-notice": "Kindly pay your invoice within 30 days.",
    };

    const invoicePdf = async () => {
      let result = await easyinvoice.createInvoice(data);
      fs.writeFile(
        `invoices/${existingInvoice._id}.pdf`,
        result.pdf,
        "base64",
        function (error) {
          if (error) {
            next(error);
          }
        }
      );
    };
    await invoicePdf();

    response
      .status(200)
      .json({ message: "invoice updated successfully.", updatedInvoice });
  } catch (error) {
    next(error);
  }
};

// Remove a invoice
exports.removeInvoice = async (request, response, next) => {
  try {
    const invoice = await invoiceSchema.findByIdAndDelete(
      request.params.id || request.body.id
    );
    if (!invoice) {
      return next(new Error("invoice not found"));
    }
    fs.unlinkSync(`invoices/${invoice._id}.pdf`);
    const patient = await patientSchema.findOne({ _id: invoice.patient_Id });
    console.log(invoice._id);
    patient.invoices = patient.invoices.filter(
      (i) => i.invoice_id !== invoice._id);
    await patient.save();
    response
      .status(201)
      .json({ message: "Invoice removed successfully.", invoice });
  } catch (error) {
    next(error);
  }
};

// Get a invoice by ID
exports.getInvoiceById = async (request, response, next) => {
  try {
    const invoice = await invoiceSchema.findById(request.params.id);
    if (!invoice) {
      return next(new Error("invoice not found"));
    }
    response.status(200).json({ invoice });
  } catch (error) {
    next(error);
  }
};

// All Invoice Reports
exports.allInvoicesReports = (request, response, next) => {
  invoiceSchema
    .find()
    .populate({ path: "clinic_Id", select: { _id: 0 } })
    .populate({ path: "patient_Id", select: { _id: 0 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Daily Invoice Reports
exports.dailyInvoicesReports = (request, response, next) => {
  let date = new Date();
  date.setHours(0, 0, 0);
  let day = 60 * 60 * 24 * 1000;
  let nextDay = new Date(date.getTime() + day);
  invoiceSchema
    .find({ date: { $gt: date, $lt: nextDay } })
    .populate({ path: "clinic_Id", select: { _id: 0 } })
    .populate({ path: "patient_Id", select: { _id: 0 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

// Patient Invoice Reports
exports.patientInvoicesReports = (request, response, next) => {
  invoiceSchema
    .find({ patient_Id: request.params.id })
    .populate({ path: "clinic_Id", select: { _id: 0 } })
    .populate({ path: "patient_Id", select: { _id: 0 } })
    .then((data) => {
      response.status(200).json(data);
    })
    .catch((error) => next(error));
};

const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id: "_id",
    clinicId: "clinic_Id",
    patientId: "patient_Id",
    total: "total",
    services: "services",
  };

  const replacedQuery = {};
  for (const key in query) {
    let newKey = key;
    for (const replaceKey in fieldsToReplace) {
      if (key.includes(replaceKey)) {
        newKey = key.replace(replaceKey, fieldsToReplace[replaceKey]);
        break;
      }
    }
    replacedQuery[newKey] = query[key]; 
  }
  return replacedQuery;
};
