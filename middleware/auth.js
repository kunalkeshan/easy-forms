//Importing Packages
const jwt = require("jsonwebtoken");
const con = require("../database/database");
const app_functions = require("./app_functions");
const util = require("util");
require("dotenv").config();

//Connecting Database and sending Queries
const query = util.promisify(con.query).bind(con);

const auth = async (req, res, next) => {
  const token = req.cookies.easy_forms_auth_token;
  if (!token) {
    return res.status(401).json({ msg: "Please Authorize!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.payload.user_details;
    delete req.user.password;

    //Get User Image Query
    const getUserImage = `SELECT * FROM images WHERE imageid='${req.user.user_image}'`;
    const userImage = await query(getUserImage);
    if (userImage.length > 0) {
      const image = app_functions.parseData(userImage);
      req.user.image_path = image[0].image_path;
      console.log(req.user);
    } else throw new Error();

    return next();
  } catch (error) {
    console.log({ Auth_Middleware: error });
    return res.status(400).json({ msg: "An error has occured" });
  }
};

module.exports = auth;
