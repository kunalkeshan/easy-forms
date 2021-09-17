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


//Create Form Route, Returns Formid and Sectionid
Router.post("/form/create", auth, async (req, res) => {
    const userid = req.user.userid;
    const formid = shortid.generate();
    const sectionid = shortid.generate();

    //Queries
    const setCreateForm = `INSERT INTO form_details(formid, userid) VALUES('${formid}', '${userid}')`; 
    const setCreateSection = `INSERT INTO form_sections(sectionid, formid) VALUES('${sectionid}', '${formid}')`;

    try {
        const createForm = await query(setCreateForm);
        if(createForm.affectedRows > 0){
            const createSection = await query(setCreateSection);
            if(createSection.affectedRows > 0){
                res.status(200).json({formid, sectionid})
            } else throw new Error();
        } else throw new Error();
    } catch (error) {
        console.log({createFormRoute: error});
        res.status(400).json({msg: "An error has occured!"});
    }
});


//Create a new Section within a form. Takes in formid.
Router.post("/form/create/section/:id", auth, async (req, res) => {
    const formid = req.params.id;
    const newSectionID = shortid.generate();

    //Queries
    const setNewSection = `INSERT INTO form_sections(sectionid, formid) VALUES('${newSectionID}', '${formid}')`;
    try {
        const newSection = await query(setNewSection);
        if(newSection.affectedRows > 0){
            res.status(200).json({newSectionID});
        }
    } catch (error) {
        console.log({newSectionRoute: error});
        res.status(400).json({msg: "An error has Occured"});
    }

});

//Create Question within a form, takes in formid and sectionid.
Router.post("/form/create/question/:sectionid/:formid", auth, async (req, res) => {
    const {sectionid, formid} = req.params;
    const {type, is_required, question_description} = req.body;
    const questionid = shortid.generate();

    //Queries
    const setNewQuestion = `INSERT INTO form_questions(questionid, formid, sectionid, type, question_description, is_required) VALUES('${questionid}', '${formid}', '${sectionid}', '${type}', '${question_description}', '${is_required}')`;

    try {
        if(type === "mcq"){
            const {options} = req.body;
            const MCQ_OPTIONS = JSON.parse(options);
            const newQuestion = await query(setNewQuestion);
            if(newQuestion.affectedRows > 0){
                let OPTN = {};
                MCQ_OPTIONS.forEach(async (option, index) => {
                    const optionid = shortid.generate();
                    const setNewOption = `INSERT INTO form_question_mcqs(optionid, formid, questionid, option_value) VALUES('${optionid}', '${formid}', '${questionid}', '${option}')`;
                    const newOption = await query(setNewOption);
                    if(newOption.affectedRows > 0){
                        OPTN[index] = optionid;
                        if(index === MCQ_OPTIONS.length - 1){
                            const optionsid = JSON.stringify(OPTN);
                            res.status(200).json({questionid, optionsid})
                        }
                    } else throw new Error();

                });
            } else throw new Error();
        } else {
            const newQuestion = await query(setNewQuestion);
            if(newQuestion.affectedRows > 0){
                res.status(200).json({questionid});
            } else throw new Error();
        }
    } catch (error) {
        console.log({createQuestionRoute: error});
        res.status(400).json({msg: "An error has Occured!"})
    }
    
});

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
    try {
        const Form = await query(getForm);
        const specificForm = app_functions.parseData(Form);
        if(specificForm.length > 0){
            specificForm[0].created_at = app_functions.convertDate(specificForm[0].created_at);
            res.status(200).json(specificForm);
        } else throw new Error();
    } catch (error) {
        console.log({getSingleFormRoute: error});
        res.status(400).json({msg: "An error has occured!"});
    }
});


//Edit an Already Existing Form.
Router.post("/form/edit/:id", auth, async (req, res) => {
    const userid = req.user.userid;
    const formid = req.params.id;

    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${formid}' AND userid='${userid}'`;

    try {
        const Form = await query(getForm);
        const specificForm = app_functions.parseData(Form);
        const editedForm = {...specificForm, ...req.body}
        if(Form.length > 0){
            
        }
    } catch (error) {
        console.log({editFormRoute: error});
        res.status(400).json({msg: "An error has occured"});
    }
});

module.exports = Router;