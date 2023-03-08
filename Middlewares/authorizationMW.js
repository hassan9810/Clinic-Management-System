const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    const token = request.get("authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    request.userData = {
      id: decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role,
    };
  } catch (error) {
    error.status = 403;
    error.message = "You are not authorized";
    next(error);
  }
  next();
};

module.exports.access = (...roles) => {
  return (request, response, next) => {
    if (
      request.userData.role !== "admin" &&
      !roles.includes(request.userData.role)
    ) {
      const error = new Error("You are not authorized to access this resource");
      error.status = 403;
      next(error);
    } else if (
      request.userData.id != request.params.id &&
      request.userData.role !== "admin"
    ) {
      const error = new Error("You have no access to this resource");
      error.status = 403;
      next(error);
    } else {
      next();
    }
  };
};

module.exports.accessClinicResources = (...roles) => {
  return (request, response, next) => {
    if (
      request.userData.role !== "admin" &&
      !roles.includes(request.userData.role)
    ) {
      const error = new Error("You are not authorized to access this resource");
      error.status = 403;
      next(error);
    } else {
      next();
    }
  };
};


module.exports.accessPay = (...roles) => {
  return (request, response, next) => {
    if (
      request.userData.role !== "admin" &&
      !roles.includes(request.userData.role)
    ) {
      const error = new Error("You are not authorized to access this resource");
      error.status = 403;
      next(error);
    } else if (
      request.userData.id != request.body.id &&
      request.userData.role !== "admin"
    ) {
      const error = new Error("You have no access to this resource");
      error.status = 403;
      next(error);
    } else {
      next();
    }
  };
};
module.exports.accessAppointment = (...roles) => {
  return (request, response, next) => {
    if (
      request.userData.role !== "admin" &&
      !roles.includes(request.userData.role)
    ) {
      const error = new Error("You are not authorized to access this resource");
      error.status = 403;
      next(error);
    } else if (
      request.userData.id != request.body.patientId &&
      request.userData.role !== "admin"
    ) {
      const error = new Error("You have no access to this resource");
      error.status = 403;
      next(error);
    } else {
      next();
    }
  };
};
