const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const users = require("../Models/usersModel");
exports.login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const foundUser = await users.findOne({_email: email});
    if (!foundUser) {
      return next(new Error("Invalid Credentials"));
    }
    const isMatch = await bcrypt.compare(password, foundUser._password);
    if (!isMatch) {
      return response.status(200).json({ message: "Invalid Password" });
    }
    
    const token = jwt.sign(
      {
        role: foundUser._role,
        email,
        id: foundUser._idInSchema,
        forClinic: foundUser._forClinic || undefined,
        id: foundUser._idInSchema,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );    
    return response.status(200).json({ message: `${foundUser._role.charAt(0).toUpperCase() + foundUser._role.slice(1)} login successful`, token });
  } catch (error) {next(error);}
};
