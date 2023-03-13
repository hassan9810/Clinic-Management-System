const { check, param } = require("express-validator");

/** validation for patient data using express validator **/
let validateClinic = [
  check("address.street")
    .isString()
    .withMessage("street should be string")
    .isLength({ min: 2 })
    .withMessage("length of street should be greater than 1 character"),
  check("address.city")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("city should be string")
    .isLength({ min: 3 })
    .withMessage("length of city should be greater than 2 characters"),
  check("address.country")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("country should be string")
    .isLength({ min: 3 })
    .withMessage("length of country should be greater than 2 characters"),
  check("address.zipCode")
    .isInt()
    .withMessage("zip code should be a number")
    .isLength({ min: 5, max: 5 })
    .withMessage("length of zip code should be 5 characters"),
  check("email")
    .isEmail()
    .withMessage("email should be in form example@example.com"),
  check("phone")
    .matches(/^01[0125](\-)?[0-9]{8}$/)
    .withMessage("Contact number should be a number"),
  check("speciality")
    .isString()
    .withMessage("Speciality must be string")
    .isIn([
      "Pediatrics",
      "Women's Health",
      "Cardiology",
      "Neurology",
      "Dental",
      "Physical Therapy",
      "Radiologic",
      "Dermatology",
      "Surgical",
    ])
    .withMessage("Clinic's speciality isn't available"),
];
let validatePatchClinic = [
  check("address.street")
    .optional()
    .isString()
    .withMessage("street should be string")
    .isLength({ min: 2 })
    .withMessage("length of street should be greater than 1 character"),
  check("address.city")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("city should be string")
    .isLength({ min: 3 })
    .withMessage("length of city should be greater than 2 characters"),
  check("address.country")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("country should be string")
    .isLength({ min: 3 })
    .withMessage("length of country should be greater than 2 characters"),
  check("address.zipCode")
    .optional()
    .isInt()
    .withMessage("zip code should be a number")
    .isLength({ min: 5, max: 5 })
    .withMessage("length of zip code should be 5 characters"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("email should be in form example@example.com"),
  check("phone")
    .optional()
    .matches(/^01[0125](\-)?[0-9]{8}$/)
    .withMessage("Contact number should be a number"),
  check("speciality")
    .optional()
    .isString()
    .withMessage("Speciality must be string")
    .isIn([
      "Pediatrics",
      "Women's Health",
      "Cardiology",
      "Neurology",
      "Dental",
      "Physical Therapy",
      "Radiologic",
      "Dermatology",
      "Surgical",
    ])
    .withMessage("Clinic's speciality isn't available"),
];
let validatePerson = [
  check("firstname")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("lastname")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("dateOfBirth")
    .matches(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    )
    .withMessage("Invalid date format, should be DD/MM/YYYY"),
  check("gender")
    .isIn(["male", "female"])
    .withMessage("gender must be either male or female"),
  check("phone")
    .matches(/^01[0125](\-)?[0-9]{8}$/)
    .withMessage("Contact number should be a number"),
  check("password").isStrongPassword().withMessage("password should be strong"),
  check("email")
    .isEmail()
    .withMessage("email should be in form example@example.com"),
  check("address.street")
    .isString()
    .withMessage("street should be string")
    .isLength({ min: 2 })
    .withMessage("length of street should be greater than 1 character"),
  check("address.city")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("city should be string")
    .isLength({ min: 3 })
    .withMessage("length of city should be greater than 2 characters"),
  check("address.country")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("country should be string")
    .isLength({ min: 3 })
    .withMessage("length of country should be greater than 2 characters"),
  check("address.zipCode")
    .isInt()
    .withMessage("zip code should be a number")
    .isLength({ min: 5, max: 5 })
    .withMessage("length of zip code should be 5 characters"),
];
let validatePatchPerson = [
  check("_id").optional().isNumeric().withMessage("Id should be a number"),
  check("firstname")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("lastname")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Name should be a string and contain only letters and spaces")
    .isLength({ min: 3 })
    .withMessage("length of name should be greater than 3 characters"),
  check("dateOfBirth")
    .optional()
    .matches(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    )
    .withMessage("Invalid date format, should be DD/MM/YYYY"),
  check("gender")
    .optional()
    .isIn(["male", "female"])
    .withMessage("gender must be either male or female"),
  check("phone")
    .optional()
    .matches(/^01[0125](\-)?[0-9]{8}$/)
    .withMessage("Contact number should be a number"),
  check("email")
    .isEmail()
    .optional()
    .withMessage("email should be in form example@example.com"),
  check("password")
    .optional()
    .isStrongPassword()
    .withMessage("password should be strong"),
  check("address.street")
    .optional()
    .isString()
    .withMessage("street should be string")
    .isLength({ min: 2 })
    .withMessage("length of street should be greater than 1 character"),
  check("address.city")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("city should be string")
    .isLength({ min: 3 })
    .withMessage("length of city should be greater than 2 characters"),
  check("address.country")
    .optional()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("country should be string")
    .isLength({ min: 3 })
    .withMessage("length of country should be greater than 2 characters"),
  check("address.zipCode")
    .optional()
    .isInt()
    .withMessage("zip code should be a number")
    .isLength({ min: 5, max: 5 })
    .withMessage("length of zip code should be 5 characters"),
];
let validatePatient = [
  validatePerson,
  check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
];
let validatePatchPatient = [
  validatePatchPerson,
  check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
];
let doctorValidation = [
  validatePerson,
  check("speciality")
    .isIn([
      "Pediatrician",
      "Gynecologist",
      "Cardiologist",
      "Dermatologist",
      "Psychiatrist",
      "Neurologist",
      "Radiologist",
      "Dentist",
      "Surgeon",
    ])
    .withMessage("Doctor's speciality isn't provided"),
  check("schedule").isArray().withMessage("Enter Schedule"),
  check("schedule.*").isObject().withMessage("Fill in the schedule"),
  check("schedule.*.day")
    .isIn([
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ])
    .withMessage("Invalid day, Should be ( Saturday,Sunday,... )"),
  check("schedule.*.start")
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid Start time format, should be in the form 00:00"),
  check("schedule.*.end")
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid End time format, should be in the form 00:00"),
    check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
];
let doctorPatchValidation = [
  validatePatchPerson,
  check("speciality")
    .optional()
    .isString()
    .withMessage("Speciality must be string")
    .isIn([
      "Pediatrician",
      "Gynecologist",
      "Cardiologist",
      "Dermatologist",
      "Psychiatrist",
      "Neurologist",
      "Radiologist",
      "Dentist",
      "Surgeon",
    ])
    .withMessage("Doctor's speciality isn't available"),
  check("schedule.day")
    .optional()
    .isIn([
      "Saturday",
      "saturday",
      "Sunday",
      "sunday",
      "Monday",
      "monday",
      "Tuesday",
      "tuesday",
      "Wednesday",
      "wednesday",
      "Thursday",
      "thursday",
      "Friday",
      "friday",
    ])
    .withMessage("Invalid day, Should be ( Saturday,Sunday,... )"),
  check("schedule.start")
    .optional()
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid Start time format, should be in the form 00:00"),
  check("schedule.end")
    .optional()
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid End time format, should be in the form 00:00"),
    check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
];
let numberIdParamsValidation = [
  param("id").isInt().withMessage("ID must be number"),
];
let employeeValidation = [
  validatePerson,
  check("salary").isInt().withMessage("salary should be number"),
  check("workingHours").isInt().withMessage("workingHours should be number"),
  check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
];
let employeePatchValidation = [
  validatePatchPerson,
  check("salary").optional().isInt().withMessage("salary should be number"),
  check("workingHours")
    .optional()
    .isInt()
    .withMessage("workingHours should be number"),
    check("medicalHistory")
    .optional()
    .isString()
    .withMessage("medical history should be a string"),
];
let medicineValidation = [
  check("name").isString().withMessage("Name should be a string"),
  check("production")
    .isString()
    .withMessage("Production Date should be a string"),
  check("expiry").isString().withMessage("Expiry Date should be a string"),
  check("leaflet").isString().withMessage("Medicine leaflet should be a string"),
  check("price").isInt().withMessage("Medicine Price should be a Number"),
  check("quantity").isInt().withMessage("Medicine Price should be a Number"),
];
let medicinePatchValidation = [
  check("name").optional().isString().withMessage("Name should be a string"),
  check("production")
    .optional()
    .isString()
    .withMessage("Production Date should be a string"),
  check("expiry")
    .optional()
    .isString()
    .withMessage("Expiry Date should be a string"),
  check("leaflet")
    .optional()
    .isString()
    .withMessage("Medicine leaflet should be a string"),
  check("price")
    .optional()
    .isInt()
    .withMessage("Medicine Price should be a Number"),
  check("quantity")
    .optional()
    .isInt()
    .withMessage("Medicine Price should be a Number"),
];
let validateAppointment = [
  check("patientId").isNumeric().withMessage("Patient Id should be a number"),
  check("doctorId").isNumeric().withMessage("Doctor Id should be a number"),
  check("clinicId").isNumeric().withMessage("clinic Id should be a number"),
  check("date")
    .matches(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    )
    .withMessage("Invalid date format, should be DD/MM/YYYY"),
  check("time")
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format, should be in the form 00:00"),
  check("status")
    .optional()
    .isIn(["Pending", "Accepted", "Declined", "Completed"])
    .withMessage("Invalid appointment status"),
];
let validatePatchAppointment = [
  check("patientId")
    .optional()
    .isNumeric()
    .withMessage("Patient Id should be a number"),
  check("doctorId")
    .optional()
    .isNumeric()
    .withMessage("Doctor Id should be a number"),
  check("clinicId")
    .optional()
    .isNumeric()
    .withMessage("clinic Id should be a number"),
  check("date")
    .optional()
    .matches(
      /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
    )
    .withMessage("Invalid date format, should be DD/MM/YYYY"),
  check("time")
    .optional()
    .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format, should be in the form 00:00"),
  check("status")
    .optional()
    .isIn(["Pending", "Accepted", "Declined", "Completed"])
    .withMessage("Invalid appointment status"),
];
let validatePrescription = [
  check("clinic")
    .isNumeric()
    .withMessage("Clinic is required and should be a number"),
  check("patient")
    .isNumeric()
    .withMessage("Patient is required and should be a number"),
  check("doctor")
    .isNumeric()
    .withMessage("Doctor is required and should be a number"),
  check("medicine").isArray().withMessage("medicine should be an array"),
  check("medicine.*.name")
    .isString()
    .withMessage("medicine name should be a string"),
  check("medicine.*.dose")
    .isString()
    .withMessage("medicine dose should be a string"),
  check("medicine.*.frequency")
    .isString()
    .withMessage("medicine frequency should be a string"),
  check("medicine.*.type")
    .isIn(["syrup", "tablet", "capsule", "injection"])
    .withMessage(
      "Medication type must be either syrup, tablet, capsule, or injection"
    ),
  check(
    "instructions",
    "Instructions should have a minimum length of 5 characters"
  )
    .optional()
    .if((value) => value)
    .isLength({ min: 5 }),
];
let validatePatchPrescription = [
  check("clinic")
    .optional()
    .isNumeric()
    .withMessage("Clinic is required and should be a number"),
  check("patient")
    .optional()
    .isNumeric()
    .withMessage("Patient is required and should be a number"),
  check("doctor")
    .optional()
    .isNumeric()
    .withMessage("Doctor is required and should be a number"),
  check("medicine")
    .optional()
    .isArray()
    .withMessage("medicine should be an array"),
  check("medicine.*.name")
    .optional()
    .isString()
    .withMessage("medicine name should be a string"),
  check("medicine.*.dose")
    .optional()
    .isString()
    .withMessage("medicine dose should be a string"),
  check("medicine.*.frequency")
    .optional()
    .isString()
    .withMessage("medicine frequency should be a string"),
  check("medicine.*.type")
    .optional()
    .isIn(["syrup", "tablet", "capsule", "injection"])
    .withMessage(
      "Medication type must be either syrup, tablet, capsule, or injection"
    ),
  check(
    "instructions",
    "Instructions should have a minimum length of 5 characters"
  )
    .optional()
    .if((value) => value)
    .isLength({ min: 5 }),
];
let validateInvoice = [
  check("patientId").isNumeric().withMessage("Patient Id should be a number"),
  check("clinicId").isNumeric().withMessage("clinic Id should be a number"),
  check("services")
    .isArray()
    .withMessage("Services must be entered as an array"),
  check("services.*.name")
    .isString()
    .withMessage("services name should be a string"),
  check("services.*.additionalCosts")
    .optional()
    .isNumeric()
    .withMessage("services cost should be a number"),
  check("services.*.notes")
    .optional()
    .isString()
    .withMessage("services notes should be a string"),
  check("paymentMethod")
    .optional()
    .isIn(["cash", "credit", "insurance"])
    .withMessage("Invalid paymentMethod"),
  check("status")
    .optional()
    .isIn(["paid", "unpaid", "partial"])
    .withMessage("Invalid invoice status"),
  check("amountPaid")
    .optional()
    .isNumeric()
    .withMessage("amountPaid should be a number"),
  check("amountDue")
    .optional()
    .isNumeric()
    .withMessage("amountDue should be a number"),
];
let validatePatchInvoice = [
  check("patientId")
    .optional()
    .isNumeric()
    .withMessage("Patient Id should be a number"),
  check("clinicId")
    .optional()
    .isNumeric()
    .withMessage("clinic Id should be a number"),
  check("services")
    .optional()
    .isArray()
    .withMessage("Services must be entered as an array"),
  check("services.*.name")
    .isString()
    .withMessage("services name should be a string"),
  check("services.*.additionalCosts")
    .optional()
    .isNumeric()
    .withMessage("services cost should be a number"),
  check("services.*.notes")
    .optional()
    .isString()
    .withMessage("services notes should be a string"),
  check("paymentMethod")
    .optional()
    .isIn(["cash", "credit", "insurance"])
    .withMessage("Invalid paymentMethod"),
  check("status")
    .optional()
    .isIn(["paid", "unpaid", "partial"])
    .withMessage("Invalid invoice status"),
  check("amountPaid")
    .optional()
    .isNumeric()
    .withMessage("amountPaid should be a number"),
  check("amountDue")
    .optional()
    .isNumeric()
    .withMessage("amountDue should be a number"),
];
let validateLogin = [
  check("email")
    .isEmail()
    .withMessage("email should be in form example@example.com"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

let validatePayment = [
  check('amount')
    .not().isEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
  check('card_number')
    .not().isEmpty()
    .withMessage("Card number is required"),
  check('exp_month')
    .not().isEmpty()
    .withMessage("Expiration month is required")
    .isNumeric()
    .withMessage("Expiration month must be a number"),
  check('exp_year')
    .not().isEmpty()
    .withMessage("Expiration year is required")
    .isNumeric()
    .withMessage("Expiration year must be a number"),
  check('cvc')
    .not().isEmpty()
    .withMessage("CVC is required")
    .isNumeric()
    .withMessage("CVC must be a number"),
];
module.exports = {
  validateClinic,
  validatePatchClinic,
  validatePatient,
  validatePatchPatient,
  doctorValidation,
  doctorPatchValidation,
  employeeValidation,
  employeePatchValidation,
  numberIdParamsValidation,
  medicineValidation,
  medicinePatchValidation,
  validateAppointment,
  validatePatchAppointment,
  validatePrescription,
  validatePatchPrescription,
  validateInvoice,
  validatePatchInvoice,
  validateLogin,
  validatePayment
};
