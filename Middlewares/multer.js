const multer = require("multer");

const setMulter = (user_type) => {
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `images/${user_type}s`);
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${user_type}-${Date.now()}.${extension}`);
    },
  });
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  return multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
};
module.exports.setMulter = setMulter;
