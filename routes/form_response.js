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
    const {submission} = req.body;
    // const {formdetails, sections, questions, options} = response;
    const {formdetails, responses} = submission;
// Expected response to be, form details, sections array, questions array,
// options array (if any), responses associated will be with the questions

//or alternatively we can return formdetails and response object
//response will have response.sections, response.questions, 
// response.options and response.response (or) response.questions[n].response

    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${formid}'`;
    try {
        let Form = await query(getForm);
        if(Form.length > 0){
            Form = app_functions.parseData(Form);
            Form = Form[0];
            if(formdetails.formid === Form.formid){
                let count = 0;
                for(let response in responses){
                    //Queries
                    const setNewResponse = `INSERT INTO form_responses (formid, sectionid, questionid, response_description) VALUES('${Form.formid}', '${response.section.sectionid}', '${response.question.questionid}', '${response.response_description}')`;
                    const newResponse = await query(setNewResponse);
                    if(newResponse.affectedRows > 0){
                        count++;
                        if(count === responses.length - 1){
                            res.status(200).json({msg: "Response Accepted!"})
                        }
                    }
                }
            } else res.status(400).json({msg: "Wrong Form"});
        } else res.status(400).json({msg: "Form does not exist"});
    } catch (error) {
        console.log({formResponseRoute: error});
        res.status(400).json({msg: "An error has Occured"});
    }
});


module.exports = Router;;