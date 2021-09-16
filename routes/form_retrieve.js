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



//Get all the forms of a specific user.
Router.get("/forms", auth, async (req, res) => {
   const userid = req.user.userid;
   
   //Queries
   const getForm = `SELECT * FROM form_details WHERE userid='${userid}'`;

   try {
       const allForms = await query(getForm);
       if(allForms.length > 0){
            const formCollection = app_functions.parseData(allForms);
            formCollection.forEach((form, index) => {
                form.created_at = app_functions.convertDate(form.created_at);
                if(index === formCollection.length - 1){
                    res.status(200).json(formCollection);
                }
            })
       } else {
           res.status(200).json({msg: "No forms created"});
       }
   } catch (error) {
       console.log({getAllFormsRouter: error});
       res.status(400).json({msg: "An error has occured!"});
   }
});


//Get a Single Form of a specific user.
Router.get("/form/:id", auth, async (req, res) => {
    const userid = req.user.userid;
    const formid = req.params.id;

    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${formid}' AND userid='${userid}'`;

    const getFormAndSections = `SELECT form_details.*, form_sections.* FROM form_details INNER JOIN form_sections ON form_details.formid = form_sections.formid WHERE form_details.formid = '${formid}'`;

    const getSectionsAndQuestions = `SELECT form_sections.*, from_questions.* FROM form_sections INNER JOIN ON form_sections.formid = from_questions.formid WHERE form_sections.formid = '${formid}'`;

    const getQuestionsAndOptions = `SELECT form_questions.*, form_question_mcqs.* FROM form_questions INNER JOIN ON form_questions.formid = form_question_mcqs.formid WHERE form_questions.formid = '${formid}'`;

    try {
        // const Form = await query(getForm);
        // const specificForm = app_functions.parseData(Form);
        // if(specificForm.length > 0){
        //     specificForm[0].created_at = app_functions.convertDate(specificForm[0].created_at);
        //     res.status(200).json(specificForm);
        // } else throw new Error();

        const formAndSections = await query(getFormAndSections);
        const sectionsAndQuestions = await query(getSectionsAndQuestions);
        const questionsAndOptions = await query(getQuestionsAndOptions);

        res.status(200).json({formAndSections, sectionsAndQuestions, questionsAndOptions});

    } catch (error) {
        console.log({getSingleFormRoute: error});
        res.status(400).json({msg: "An error has occured!"});
    }
});


module.exports = Router;