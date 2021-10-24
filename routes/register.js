//Importing Packages
const Router = require("express").Router();
const util = require("util");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const bcrypt = require("bcryptjs");

Router.use(cookieParser());

//Importing Middleware
const con = require("../database/database");
const app_functions = require("../middleware/app_functions");
const auth = require("../middleware/auth");

//Connecting Database and sending Queries
const query = util.promisify(con.query).bind(con);

//Sign-Up Route
Router.post("/signup", async(req, res) => {
    const {name, username, email, password, isSaved} = req.body;
    const check = {
        username: false, email: false
    }
    //Queries
    const checkEmail = `SELECT * FROM user_details WHERE email='${email}';`
    const checkUsername = `SELECT * FROM user_details WHERE username='${username}'`
    try {
        const emailExist = await query(checkEmail);
        const usernameExist = await query(checkUsername);

        if(emailExist.length) check.email = true;
        if(usernameExist.length) check.username = true;

        if(emailExist.length == 0 && usernameExist.length == 0 && isSaved){
            const userid = shortid.generate()
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
            const signUpUser = `INSERT INTO user_details (userid, name, email, username, password) VALUES ('${userid}', '${name}', '${email}', '${username}', '${hashedPassword}');`;
            const response = await query(signUpUser);
            if(response.affectedRows > 0){
                const getNewUser = `SELECT * FROM user_details WHERE userid = '${userid}'`;
                let newUser = await query(getNewUser)
                newUser = app_functions.parseData(newUser);
                console.log(newUser)
                const user_details = newUser
                //Generating JWT Cookie
                const payload = {user_details};
                const token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: "1d"});
                res.cookie("easy_forms_auth_token", token, {httpOnly: true});
                res.status(201).json({message: "User Created Successfully"});
            } else throw new Error();
            
        } else {
            res.status(200).json({message: "User Already Exists", check});
        }
    } catch (error) {
        console.log({signUpRoute: error});
        res.status(400).json({message: "An error has occured!"});
    }
});

//Sign-In Route
Router.post("/signin",  async (req, res) => {
    const {user, password, type} = req.body;
    try {
        if(type === 0){
            //Email Sign In
            const emailSignIn = `SELECT * FROM user_details WHERE email='${user}'`;
            const response = await query(emailSignIn);
            const user_details = app_functions.parseData(response)[0];

            //Validating Passoword
            const valid_password = await bcrypt.compare(password, user_details.password);
            if(valid_password){
                //Generating JWT Cookie
                const payload = {user_details};
                const token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: "1d"});
                res.cookie("easy_forms_auth_token", token, {httpOnly: true});
                res.status(200).json({message: "Email Sign In Successful!"});
            } else  {
                throw new Error();
            }
        } else {
            //Username Sign In
            const usernameSignIn = `SELECT * FROM user_details WHERE username='${user}'`;
            const response  = await query(usernameSignIn);
            console.log(response);
            let user_details = app_functions.parseData(response);
            user_details = user_details[0]

            //Validating Password
            const valid_password = await bcrypt.compare(password, user_details.password);
            if(valid_password){
                //Generating JWT Cookie
                const payload = {user_details};
                const token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: "1d"});
                res.cookie("easy_forms_auth_token", token, {httpOnly: true});
                res.status(200).json({message: "Username Sign In Successful!"});
            } else {
                throw new Error();
            }
        }
    } catch (error) {
        console.log({signInRoute: error});
        res.status(400).json({message: "Invalid Credentials!"})
    }
});

//Sign Out Route
Router.get("/signout", auth, (req, res) => {
    res.clearCookie("easy_forms_auth_token");
    res.redirect("/");
});

module.exports = Router;
