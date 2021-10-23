const Router = require("express").Router();
const util = require("util");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

Router.use(cookieParser());

//Importing Middleware
const con = require("../database/database");
const auth = require("../middleware/auth");
const app_functions = require("../middleware/app_functions");

//Connecting Database and sending Queries
const query = util.promisify(con.query).bind(con);

//Get User Profile
Router.get("/profile", auth, async (req, res) => {
  const user = req.user;
  user.created_at = app_functions.convertDate(user.created_at);
  const page = {
    link: "profile",
    title: `${user.name} | Easy-Forms`
  }

  console.log(page)
  res.render("profile", {user, page});
});

//Edit User Profile
Router.post("/profile/edit", auth, async (req, res) => {
    const {name, username, email, password, newPassword, changeFor, isSaved} = req.body;
    const userid = req.user.userid;
    let detailsExist = {username: false, email: false, samePassword: false};

    //Queries
    const getUser = `SELECT * FROM user_details WHERE userid='${userid}'`;
    const getUserName = `SELECT username FROM user_details WHERE username='${username}' AND NOT userid='${userid}'`;
    const getEmail = `SELECT email FROM user_details WHERE email='${email}' AND NOT userid='${userid}'`;

    //changeFor = 0, then edit the user details 
    //else edit password (i.e. changeFor = 1)

    try {

      let User = await query(getUser);
      let UserName = await query(getUserName);
      let Email = await query(getEmail);

      User = app_functions.parseData(User);
      User = User[0];
      UserName = app_functions.parseData(UserName);
      Email = app_functions.parseData(Email);

      const validPassword = await bcrypt.compare(password, User.password);

      if(changeFor === 0){

        if(UserName.length > 0) detailsExist.username = true;
        if(Email.length > 0) detailsExist.email = true;

        if(isSaved === 1 && !(detailsExist.username || detailsExist.email)){
          if(validPassword){
            //Query
            const updateUserDetails = `UPDATE user_details SET name='${name}', username='${username}', email='${email}' WHERE userid='${userid}'`;
            const updatedUser = await query(updateUserDetails);
            if(updatedUser.affectedRows > 0){
              res.status(200).json({msg: "Details Updated"});
            } else throw new Error();
          } else res.status(400).json({msg: "Wrong Password!"});
        } else res.status(200).json({detailsExist});

      } else {
        const samePassword = await bcrypt.compare(newPassword, User.password);
        if(samePassword) detailsExist.samePassword = true;
        if(isSaved === 1 && !samePassword){
          if(validPassword){
            const hashPassword = await bcrypt.hash(newPassword, 10);
            //Query
            const updateUserPassword = `UPDATE user_details SET password = '${hashPassword}' WHERE userid='${userid}'`;
            const updatedPassword = await query(updateUserPassword);
            if(updatedPassword.affectedRows > 0){
              res.status(200).json({msg: "Password Updated"});
            } else throw new Error();
          } else res.status(400).json({msg: "Wrong Password!"});
        } else res.status(200).json({detailsExist});
      }

    } catch (error) {
      console.log({editUserProfileRoute: error});
      res.status(400).json({msg: "An error has occured!"});
    }

});

module.exports = Router;
