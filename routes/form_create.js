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
    const {title, description} = req.body;
    const formid = shortid.generate();
    const sectionid = shortid.generate();

    //Queries
    const setCreateForm = `INSERT INTO form_details(formid, userid, title, description) VALUES('${formid}', '${userid}', '${title}', '${description}')`; 
    const setCreateSection = `INSERT INTO form_sections(sectionid, formid) VALUES('${sectionid}', '${formid}')`;

    try {
        const createForm = await query(setCreateForm);
        if(createForm.affectedRows > 0){
            const createSection = await query(setCreateSection);
            if(createSection.affectedRows > 0){
                const form = {
                    formid
                }
                res.status(200).json({message: "Form created successfully", form})
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
    const getNewSection = `SELECT * FROM form_sections WHERE sectionid='${newSectionID}'`;
    try {
        const newSection = await query(setNewSection);
        if(newSection.affectedRows > 0){
            let Section = await query(getNewSection);
            if(Section.length){
                Section = app_functions.parseData(Section)[0];
                res.status(200).json({Section});
            } else throw new Error();
        } else throw new Error();
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
        if(type === "mcq" || type === "box"){
            const {options} = req.body;
            console.log(options)
            const MCQ_OPTIONS = options;
            const newQuestion = await query(setNewQuestion);
            if(newQuestion.affectedRows > 0){
                let OPTN = [];
                MCQ_OPTIONS.forEach(async (option, index) => {
                    const optionid = shortid.generate();
                    const setNewOption = `INSERT INTO form_question_mcqs(optionid, formid, questionid, option_value, type) VALUES('${optionid}', '${formid}', '${questionid}', '${option}', '${type}')`;
                    const newOption = await query(setNewOption);
                    if(newOption.affectedRows > 0){
                        OPTN.push({optionid, option});
                        if(index === MCQ_OPTIONS.length - 1){
                            const optionsWithId = JSON.stringify(OPTN);
                            const question = {type, is_required, question_description, optionsWithId, questionid, formid, sectionid};
                            res.status(200).json({question})
                        }
                    } else throw new Error();

                });
            } else throw new Error();
        } else {
            const newQuestion = await query(setNewQuestion);
            if(newQuestion.affectedRows > 0){
                const question = {type, is_required, question_description, questionid, formid, sectionid};
                res.status(200).json({question});
            } else throw new Error();
        }
    } catch (error) {
        console.log({createQuestionRoute: error});
        res.status(400).json({msg: "An error has Occured!"})
    }
    
});

module.exports = Router;