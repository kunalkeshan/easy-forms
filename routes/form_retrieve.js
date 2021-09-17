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
    if (allForms.length > 0) {
      const formCollection = app_functions.parseData(allForms);
      formCollection.forEach((form, index) => {
        form.created_at = app_functions.convertDate(form.created_at);
        if (index === formCollection.length - 1) {
          res.status(200).json(formCollection);
        }
      });
    } else {
      res.status(200).json({ msg: "No forms created" });
    }
  } catch (error) {
    console.log({ getAllFormsRouter: error });
    res.status(400).json({ msg: "An error has occured!" });
  }
});

//Get a Single Form of a specific user.
Router.get("/form/:id", async (req, res) => {
  const userid = req.user.userid;
  const formid = req.params.id;

  let isCurrentUser = false;
  if (req.user) {
    isCurrentUser = true;
  }

  //Queries
  const getForm = `SELECT * FROM form_details WHERE formid='${formid}'`;

  const getSections = `SELECT * FROM form_sections WHERE formid='${formid}' ORDER BY created_at ASC`;

  const getQuestions = `SELECT * FROM form_questions WHERE formid='${formid}' ORDER BY created_at ASC`;

  const getQuestionsAndOptions = `SELECT form_question_mcqs.*,form_questions.* FROM form_question_mcqs LEFT JOIN form_questions ON form_question_mcqs.formid = form_questions.formid WHERE form_questions.formid = '${formid}' AND form_questions.type = 'mcq'`;

  // Error handling, add created_at for form sections for sorting
  try {
    const form = await query(getForm);
    if (form.length > 0) {
      const sections = await query(getSections);
      const questions = await query(getQuestions);

      if (sections.length > 0 || question.length > 0) {
        const AllQuestions = app_functions.parseData(questions);

        let isMCQ = false;
        AllQuestions.forEach(async (question, index) => {
          if (question.type === "mcq") {
            isMCQ = true;
          }
          if (index === AllQuestions.length - 1) {
            if (isMCQ) {
              const questionsAndOptions = await query(getQuestionsAndOptions);
              if (questionsAndOptions.length > 0) {
                res
                  .status(200)
                  .json({
                    form,
                    sections,
                    questions,
                    questionsAndOptions,
                    isCurrentUser,
                  });
              } else throw new Error();
            } else {
              res
                .status(200)
                .json({ form, sections, questions, isCurrentUser });
            }
          }
        });
      } else throw new Error();
    } else throw new Error();
  } catch (error) {
    console.log({ getSingleFormRoute: error });
    res.status(400).json({ msg: "An error has occured!" });
  }
});

module.exports = Router;
