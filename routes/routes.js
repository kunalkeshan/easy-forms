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

Router.get("/form/create", auth, async (req, res) => {
    const {formid} = req.query;

    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${formid}'`
    const getSections = `SELECT * FROM form_sections WHERE formid='${formid}' ORDER BY created_at ASC`;

    try {

        let Form = await query(getForm);
        
        
        if(Form.length){
            let Sections = await query(getSections);
            
            Form = app_functions.parseData(Form)[0];
            Sections = app_functions.parseData(Sections)

            const page = {
                link: "create",
                title: "Create | Easy-Forms",
            }
            res.render("create", {page, user: req.user, Form, Sections, Questions: [], QuestionsAndOptions: []});
        }

        
    } catch (error) {
        app_functions.renderError(res);
        console.log(error);
    }

});

Router.get("/form/edit", auth, async (req, res) => {
    const {formid} = req.query;

    //Queries
    const getForm = `SELECT * FROM form_details WHERE formid='${formid}'`
    const getSections = `SELECT * FROM form_sections WHERE formid='${formid}' ORDER BY created_at ASC`
    const getQuestions = `SELECT * FROM form_questions WHERE formid='${formid}' ORDER BY created_at ASC`;
    // const getQuestionsAndOptions = `SELECT form_question_mcqs.*,form_questions.questionid FROM form_question_mcqs LEFT JOIN form_questions ON form_question_mcqs.formid = form_questions.formid WHERE form_questions.formid = '${formid}' ORDER BY form_questions.created_at ASC`;
    const getQuestionsAndOptions = `SELECT * FROM form_question_mcqs WHERE formid='${formid}';`;
    
    try {
        let Form = await query(getForm);
        if(Form.length){
            console.log(Form)
            
            Form = app_functions.parseData(Form)[0];
            let Sections = await query(getSections);
            let Questions = await query(getQuestions);
            let QuestionsAndOptions = await query(getQuestionsAndOptions);
            Sections = app_functions.parseData(Sections)
            Questions = app_functions.parseData(Questions);
            QuestionsAndOptions = app_functions.parseData(QuestionsAndOptions);
            const page = {
                link: "create",
                title: "Edit | Easy-Forms",
            }
            res.render("create", {page, user: req.user, Form, Sections, Questions, QuestionsAndOptions});

        } else throw new Error("Form does not exist!")

        
    } catch (error) {
        app_functions.renderError(res);
        console.log(error);
    }
})


module.exports = Router;