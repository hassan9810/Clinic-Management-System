/*** callback fns for CRUD operations ***/
/* require all needed modules */
const medicineSchema = require("../Models/medicineModel");

/* require helper functions (filter,sort,slice,paginate) */
const {
  filterData,
  sortData,
  sliceData,
  paginateData,
} = require("../helper/helperfns");

exports.getAllMedicine = async (request, response, next) => {
  try {
    let query = reqNamesToSchemaNames(request.query);
    let medicine = await filterData(medicineSchema, query);
    medicine = sortData(medicine, query);
    medicine = paginateData(medicine, request.query);
    medicine = sliceData(medicine, request.query);
    response.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};

exports.addMedicine = async (request, response, next) => {
  let addedDoctor = medicineSchema({
    _name: request.body.name,
    _productionDate: request.body.production,
    _expiryDate: request.body.expiry,
    _leaflet: request.body.leaflet,
    _pricePerUnit: request.body.price,
    _quantity: request.body.quantity,
  });
  try {
    let resultData = await addedDoctor.save();
    response.status(200).json({ status: "Added" });
  } catch (error) {
    next(error);
  }
};

exports.putMedicineById = async (request, response, next) => {
  try {
    let updatedMedicine = await medicineSchema.updateOne(
      { _id: request.params.id },
      {
        $set: {
          _name: request.body.name,
          _productionDate: request.body.production,
          _expiryDate: request.body.expiry,
          _leaflet: request.body.leaflet,
          _pricePerUnit: request.body.price,
          _quantity: request.body.quantity,
        },
      }
    );
    if (!updatedMedicine)
      response.status(200).json({ status: "Medicine not found" });
    response.status(200).json({ status: "Updated", updatedMedicine });
  } catch (error) {
    next(error);
  }
};

exports.patchMedicineById = async (request, response, next) => {
  try {
  let foundMedicine = await medicineSchema.findOne({ _id: request.params.id });
  if (!foundMedicine) {
    return response.status(200).json({ message: "Medicine not found." });
  }

  let tempMedicine = {};
  tempMedicine._name = request.body.name || foundMedicine._name;
  tempMedicine._productionDate = request.body.production || foundMedicine._productionDate;
  tempMedicine._expiryDate = request.body.expiry || foundMedicine._expiryDate;
  tempMedicine._leaflet = request.body.leaflet || foundMedicine._leaflet;
  tempMedicine._pricePerUnit = request.body.price || foundMedicine._pricePerUnit;
  tempMedicine._quantity = request.body.quantity || foundMedicine._quantity;

  
    let updatedMedicine = await medicineSchema.updateOne(
      { _id: request.params.id },
      { $set: tempMedicine }
    );
    response.status(200).json({ message: "Patch successfully", updatedMedicine });
  } catch (error) {
    next(error);
  }
};


exports.removeMedicineById = async (request, response, next) => {
  try {
    let medicine = await medicineSchema.deleteOne({ _id: request.params.id });
    if (!medicine) response.status(200).json("Medicine not found");
    response.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};

exports.getMedicineById = async (request, response, next) => {
  try {
    let medicine = await medicineSchema.find({ _id: request.params.id });
    if (!medicine) {
      return next(new Error("Medicine not found"));
    }
    response.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};



const reqNamesToSchemaNames = (query) => {
  const fieldsToReplace = {
    id: '_id',
    name: '_name',
    production: '_productionDate',
    expiry: '_expiryDate',
    leaflet: '_leaflet',
    price: '_pricePerUnit',
    quantity: '_quantity',

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
}
