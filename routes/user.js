const Router = require("express").Router();
const util = require("util");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

Router.use(cookieParser());

//Importing Middleware
const con = require("../database/database");
const auth = require("../middleware/auth");
const app_functions = require("../middleware/app_functions");

//Connecting Database and sending Queries
const query = util.promisify(con.query).bind(con);

//Get User Profile
Router.get("/profile", auth, async (req, res) => {
  const user = req.user;
  user.created_at = app_functions.convertDate(user.created_at);
  res.status(200).json({ user });
});

//Edit User Profile
Router.post("/profile/edit", auth, async (req, res) => {
    const userid = req.user.userid;
});

module.exports = Router;
