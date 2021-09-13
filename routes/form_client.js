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


//Create Form Route
Router.post("/form/create", auth, (req, res) => {
    const userid = req.user.userid;
    const formid = shortid.generate();
    const sectionid = shortid.generate();
    const setCreateForm = `INSERT INTO form_details(formid, userid) VALUES('${formid}', '${userid}')`; 
    const selectForm = `SELECT * FROM form_details WHERE fomrid='${createdFormId}'`;

    try {
        // const createForm = query(setCreateForm);
        // console.log(app_functions.parseData(createForm));
        // res.send("IN test")

        res.send(createdFormId)
    } catch (error) {
        console.log({createFormRoute: error});
        res.status(400).json({msg: "An error has occured!"})
    }
});

module.exports = Router;