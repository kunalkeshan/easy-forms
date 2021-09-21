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

//Submitting a response
Router.post("/form/response/:id", async (req, res) => {
    const formid = req.params.id;
    const {response} = req.body;
// Expected response to be, form details, sections array, questions array,
// options array (if any), responses associated will be with the questions

    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${formid}'`;
    try {
        const Form = await query(getForm);
        if(Form.length > 0){
            const {formdetails, sections, questions, options} = response;
        } else res.status(400).json({msg: "Form does not exist"});
    } catch (error) {
        console.log({formResponseRoute: error});
        res.status(400).json({msg: "An error has Occured"});
    }
});


module.exports = Router;