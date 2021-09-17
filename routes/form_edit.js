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

    try {
        const Form = await query(getForm);
        if(Form.length > 0){
            const specificForm = app_functions.parseData(Form);

        }
    } catch (error) {
        console.log({editFormRoute: error});
        res.status(400).json({msg: "An error has occured"});
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