//Importing Packages
const Router = require("express").Router();
const util = require("util");
const cookieParser = require("cookie-parser");
const shortid = require("shortid");
const multer = require("multer");

Router.use(cookieParser());

//Importing Middleware
const con = require("../database/database");
const app_functions = require("../middleware/app_functions");
const auth = require("../middleware/auth");

//Connecting Database and sending Queries
const query = util.promisify(con.query).bind(con);

//upload image route
Router.post("/image/upload", auth, async (req, res) => {

});

//delete image route
Router.post("/image/delete/:id", auth, async (req, res) => {

});

module.exports = Router;