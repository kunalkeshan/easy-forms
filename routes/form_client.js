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
Router.post("form/create/section", auth, async(req, res) => {
    const userid = req.user.userid;
    const {formid} = req.body;
    const newSectionID = shortid.generate();

    //Queries
    const setNewSection = `INSERT INTO form_sections(sectionid, formid) VALUES('${newSectionID}', ''${formid})`;
    try {
        
    } catch (error) {
        
    }

});

//Create Question within a form, takes in formid and sectionid.
Router.post("/form/create/question", auth, async(req, res) => {
    
});

//Edit an Already Existing Form.
Router.post("/form/edit", auth, async(req, res) => {

});

module.exports = Router;