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
    const formid = req.params.id;

    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${fromid}'`;
    
    try {
        
    } catch (error) {
        console.log({deleteFormRoute: error});
        res.status(400).json({msg: "An error has Occured!"});
    }

});

//Delete section route
Router.post("/form/delete/section/:sectionid/:formid", auth, async (req, res) => {
    const {formid, sectionid} = req.params;

    //Queries
    const getSection = `SELECT * FROM form_sections WHERE sectionid='${sectionid}' AND formid='${formid}'`;

    try {
        
    } catch (error) {
        console.log({deleteSectionRoute: error});
        res.status(400).json({msg: "An error has occured"});
    }
});

//Delete Section route
Router.post("/form/delete/question/:questionid/:formid", auth, async (req, res) => {
    const {fomrid, questionid} = req.params;

    //Queries
    const getQuestion = `SELECT * FROM form_questions WHERE questionid='${questionid}' AND formid='${formid}'`;

    try {
        
    } catch (error) {
        console.log({deleteQuestionRoute: error});
        res.status(400).json({msg: "An error has Occured"});
    }
});

//Delete An Option Route
Router.post("/form/delete/option/:optionid/:questionid", auth, async (req, res) => {
    const {optionid, questionid} = req.params;

    //Queries
    const getOption = `SELECT * FROM form_question_mcqs WHERE questionid='${questionid}' AND optionid='${optionid}'`;

    try {
        
    } catch (error) {
        console.log({deleteOptionRoute: error});
        res.status(400).json({msg: "An error has occured!"});
    }
});

module.exports = Router;