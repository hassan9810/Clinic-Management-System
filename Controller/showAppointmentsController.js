const clinicSchema = require("../Models/clinicModel");

const {
    filterData,
    sortData,
    sliceData,
    paginateData,
} = require("../helper/helperfns");

exports.getAllWeeklySchedule = async (request, response, next) => {
    try {
        let query = reqNamesToSchemaNames(request.query);
        let clinic = await filterData(clinicSchema.find({}, { _id: 0, _weeklySchedule: 1 }), query);
        clinic = sortData(clinic, query);
        clinic = paginateData(clinic, request.query);
        clinic = sliceData(clinic, request.query);
        response.status(200).json(clinic);
    } catch (error) {
        next(error);
    }
};
const reqNamesToSchemaNames = (query) => {
    const fieldsToReplace = {
        id: "_id",
        phone: "_contactNumber",
        email: "_email",
        address: "_address",
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
