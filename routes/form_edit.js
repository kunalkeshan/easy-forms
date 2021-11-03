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

//Edit an Already Existing Form.
Router.post("/form/edit/:id", auth, async (req, res) => {
    const userid = req.user.userid;
    const formid = req.params.id;
    const {title, description} = req.body;

    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${formid}' AND userid='${userid}'`;
    const setUpdateForm = `UPDATE form_details SET title='${title}', description='${description}' WHERE formid='${formid}';`;

    try {
        const Form = await query(getForm);
        if(Form.length > 0){
            const updatedForm = await query(setUpdateForm);
            if(updatedForm.affectedRows > 0){
                res.status(200).json({message: "Form Updated Successfully"});
            } else throw new Error();
        } else throw new Error();
    } catch (error) {
        console.log({editFormRoute: error});
        res.status(400).json({msg: "An error has occured"});
    }
});


//Edit a section of an Already Existing Form.
Router.post("/form/edit/section/:sectionid/:formid", auth, async (req, res) => {
    const userid = req.user.userid;
    const {formid, sectionid} = req.params;
    const {title, description} = req.body;

    //Queries
    const getSection = `SELECT * FROM form_sections WHERE sectionid='${sectionid}' AND formid='${formid}';`;
    const setUpdateSection = `UPDATE form_sections SET title='${title}', description='${description}' WHERE sectionid='${sectionid}';`;

    try {
        
        const Section = await query(getSection);
        if(Section.length > 0){
            const updatedSection = await query(setUpdateSection);
            if(updatedSection.affectedRows > 0){
                res.status(200).json({message: "Section updated successfully"});
            } else throw new Error();
        } else throw new Error();

    } catch (error) {
        console.log({editSectionRoute: error});
        res.status(400).json({msg: "An error has occured"});
    }
    
});

//Edit a question of an already existing form.
Router.post("/form/edit/question/:questionid/:formid", auth, async (req, res) =>{
    const user = req.user.userid;
    const {questionid, formid} = req.params;
    const {type, question_description, answer_key, is_required}

    //Queries
    const getQuestion = `SELECT * FROM form_questions WHERE questionid='${questionid} AND formid='${formid}'`
    const setUpdateQuestion = `UPDATE form_questions SET type='${type}', question_description='${question_description}', answer_key='${answer_key}', is_required='${is_required}';`;

    try {

        const Question = await query(getQuestion);
        if(Question.length > 0){
            const updatedQuestion = await query(setUpdateQuestion);
            if(updatedQuestion.affectedRows > 0){
                res.status(200).json({message: "Question Updated Successfully"})
            } else throw new Error();
        } else throw new Error();
        
    } catch (error) {
        console.log({editQuestionRoute: error});
        res.status(400).json({msg: "An error has occured"});
    }

});

//Edit an option of a question of an already existing form.
Router.post("/form/edit/option/:optionid/:questionid/:formid", auth, async (req, res) => {
    const user = req.user.userid;
    const {optionid, questionid, formid} = req.params;
    const {option_value} = req.body;

    //Queries
    const getOption = `SELECT * FROM form_question_mcqs WHERE optionid='${optionid}' AND formid='${formid}';`;
    const setUpdateOption = `UPDATE form_question_mcqs SET option_value='${option_value}' WHERE optionid='${optionid}';`;

    try {
        
        const Option = await query(getOption);
        if(Option.length > 1){
            const updatedOption = await query(setUpdateOption);
            if(updatedOption.affectedRows > 0){
                res.status(200).json({message: "Option updated successfully"});
            } else throw new Error();
        } else throw new Error();

    } catch (error) {
        console.log({editOptionRoute: error});
        res.status(400).json({msg: "An error has occured"});
    }

});



module.exports = Router;