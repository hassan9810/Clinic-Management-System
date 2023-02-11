const doctorModel = require("../Models/doctorModel");
const appointmentModel = require("../Models/appointmentModel");
module.exports.checkAppointmentsDaily = async () => {
  var today = new Date().getTime();

  await doctorModel.updateMany(
    {},
    { $pull: { _appointments: { $lt: +today } } }
  );
  await appointmentModel.updateMany(
    { _id: { $lt: today }, _status: "Pending" },
    { $set: { _Pending: "Late" } }
  );
};
