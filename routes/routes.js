const Router = require("express").Router();
const util = require("util");
const cookieParser = require("cookie-parser");

Router.use(cookieParser());

//Importing Middleware
const con = require("../database/database");
const auth = require("../middleware/auth");
const app_functions = require("../middleware/app_functions");

const query = util.promisify(con.query).bind(con);

//Index Route
Router.get("/", async (req, res) => {
    if(req.user) {
        res.render("home", {page: "home", user: req.user});
    } else {
        res.render("index", {page: "index"});
    }
});

module.exports = Router;