//Importing Packages
const Router = require("express").Router();
const util = require("util");
const cookieParser = require("cookie-parser");
const shortid = require("shortid");

Router.use(cookieParser());

//Importing Middleware
const con = require("../database/database");
const app_functions = require("../middleware/app_functions");
const auth = require("../middleware/auth");

//Connecting Database and sending Queries
const query = util.promisify(con.query).bind(con);

//Delete Form route
Router.post("/form/delete/:id", auth, async (req, res) => {

});

//Delete section route
Router.post("/form/delete/section/:sectionid/:formid", auth, async (req, res) => {

});

//Delete Section route
Router.post("/form/delete/question/:questionid/:formid", auth, async (req, res) => {

});

module.exports = Router;