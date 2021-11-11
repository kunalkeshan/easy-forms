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
Router.delete("/form/delete", auth, async (req, res) => {
    const {formid} = req.query;
    const {userid} = req.user;
    
    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${formid}' AND userid='${userid}'`;
    const setDeleteForm = `DELETE FROM form_details WHERE formid='${formid}'`;
    
    try {
        
        let Form  = await query(getForm);
        Form = app_functions.parseData(Form)[0];
        if(Form.formid === formid){
            const deleteForm = await query(setDeleteForm);
            if(deleteForm.affectedRows > 0){
                res.status(200).json({message: "Form Deleted Successfully"});
            } else throw new Error();
        } else throw new Error();

    } catch (error) {
        console.log({deleteFormRoute: error});
        res.status(400).json({message: "An error has Occured!"});
    }

});

//Delete section route
Router.post("/form/delete/section/:sectionid/:formid", auth, async (req, res) => {
    const {formid, sectionid} = req.params;

    //Queries
    const getSection = `SELECT * FROM form_sections WHERE sectionid='${sectionid}' AND formid='${formid}'`;
    const getQuestionsFromSection = `SELECT * FROM form_questions WHERE sectionid='${sectionid}' AND formid='${formid}'`;
    const setDeleteSection = `DELETE * FROM form_sections WHERE sectionid='${sectionid}' AND formid='${formid}'`;

    try {

        let Section = await query(getSection);
        if(Section.length === 1){
            const deleteSection = await query(setDeleteSection);
            if(deleteSection.affectedRows > 0){
                res.status(200).json({message: "Section Deleted Successfully!"});
            } else throw new Error();
        } else {
            let questionsFromSection = await query(getQuestionsFromSection);
            if(questionsFromSection){
                Section = app_functions.parseData(Section);
                questionsFromSection = app_functions.parseData(questionsFromSection);
            }
            const updateQuestionSections = ``;
        }
        
    } catch (error) {
        console.log({deleteSectionRoute: error});
        res.status(400).json({message: "An error has occured"});
    }
});

//Delete Question route
Router.post("/form/delete/question/:questionid/:formid", auth, async (req, res) => {
    const {formid, questionid} = req.params;

    //Queries
    const getQuestion = `SELECT * FROM form_questions WHERE questionid='${questionid}' AND formid='${formid}'`;
    const setDeleteQuestion = `DELETE * FROM form_questions WHERE questionid='${questionid}' AND formid='${formid}'`

    try {
        let question = await query(getQuestion);
        if(question.length > 0) {
            const deleteQuestion = await query(setDeleteQuestion);
            if(deleteQuestion.affectedRows > 0){
                res.status(200).json({message: "Question Deleted"});
            } else throw new Error();
        } else throw new Error();
        question = app_functions.parseData(question);
    } catch (error) {
        console.log({deleteQuestionRoute: error});
        res.status(400).json({message: "An error has Occured"});
    }
});

//Delete An Option Route
Router.post("/form/delete/option/:optionid/:questionid", auth, async (req, res) => {
    const {optionid, questionid} = req.params;

    //Queries
    const getOption = `SELECT * FROM form_question_mcqs WHERE questionid='${questionid}' AND optionid='${optionid}'`;
    const setDeleteOption = `DELETE * FROM form_question_mcqs WHERE questionid='${questionid}' AND optionid='${optionid}'`;

    try {
        const Option = await query(getOption);
        if(Option.length > 0){
            const deleteOption = await query(setDeleteOption);
            if(deleteOption.affectedRows > 0){
                res.status(200).json({message: "Option Successfully Deleted!"})
            } else throw new Error();
        }
    } catch (error) {
        console.log({deleteOptionRoute: error});
        res.status(400).json({message: "An error has occured!"});
    }
});

module.exports = Router;