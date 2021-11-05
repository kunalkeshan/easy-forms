const Router = require("express").Router();
const util = require("util");
const cookieParser = require("cookie-parser");

Router.use(cookieParser());

//Importing Middleware
const con = require("../database/database");
const auth = require("../middleware/auth");
const app_functions = require("../middleware/app_functions");

//Connecting Database and sending Queries
const query = util.promisify(con.query).bind(con);

//Index Route
Router.get("/", async (req, res) => {
    // console.log(req.query);
    //If req for "/?key=val&key2=val2"
    // req.query = {key: val, key2: val2}
    const isAuthenticated = req.cookies.easy_forms_auth_token;
    if(isAuthenticated) {
        res.redirect("/home");
        return;
    }
    const page = {
        link: "index",
        title: "Easy-Forms",
    }
    res.render("index", {page});
});

Router.get("/home", auth, (req, res) => {
    const page = {
        link: "home",
        title: "Home | Easy-Forms",
    }
    res.render("home", {page, user: req.user});
});

Router.get("/dashboard", auth, (req, res) => {
    const page = {
        link: "dashboard",
        title: "Dashboard | Easy-Forms",
    }
    res.render("dashboard", {page, user: req.user});
})

Router.get("/form/create", auth, (req, res) => {
    const {formid, sectionid} = req.query;
    const page = {
        link: "create-edit",
        title: "Create | Easy-Forms",
        formid,
        sectionid
    }
    res.render("create-edit", {page, user: req.user});
})

module.exports = Router;