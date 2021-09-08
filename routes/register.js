//Importing Packages
const Router = require("express").Router();
const util = require("util");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");

//Importing Middleware
const con = require("../database/database");
const app_functions = require("../middleware/app_functions");
const auth = require("../middleware/auth");


const query = util.promisify(con.query).bind(con);

Router.post("/signup", async(req, res) => {
    const {name, username, email, password} = req.body;

    //Queries
    const checkEmail = `SELECT * FROM user_details WHERE email='${email}';`
    const checkUsername = `SELECT * FROM user_details WHERE username='${username}'`
    try {
        const emailExist = await query(checkEmail);
        const usernameExist = await query(checkUsername);
        if(app_functions.parseData(emailExist).length == 0 && app_functions.parseData(usernameExist).length == 0){
            const userid = shortid.generate()
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
            const signUpUser = `INSERT INTO user_details (userid, name, email, username, password) VALUES ('${userid}', '${name}', '${email}', '${username}', '${hashedPassword}');`;
            const response = await query(signUpUser);
            if(response.affectedRows > 0){
                const user_details = req.body
                const payload = {user_details};
                const token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: "1d"});
                res.cookie("easy_forms_auth_token", token, {httpOnly: true});
                res.status(201).json({msg: "User Created Successfully"});
            } else throw new Error();

        } else res.status(400).json({msg: "User Already Exists"});
    } catch (error) {
        console.log({signUpRoute: error});
        res.status(400).json({msg: "An error has occured!"});
    }
});

module.exports = Router;
