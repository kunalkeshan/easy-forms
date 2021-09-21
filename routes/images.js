//Importing Packages
const Router = require("express").Router();
const util = require("util");
const cookieParser = require("cookie-parser");
const shortid = require("shortid");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

Router.use(cookieParser());

//Importing Middleware
const con = require("../database/database");
const app_functions = require("../middleware/app_functions");
const auth = require("../middleware/auth");

//Connecting Database and sending Queries
const query = util.promisify(con.query).bind(con);

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images');
    },
    filename: function(req, file, cb){
        console.log(file);
        const FILENAME = Date.now() + "_" + file.originalname;
        if(req.type === "user_image"){
            req.user.image_path = `/images/user/${FILENAME}`;
        }
        cb(null, FILENAME);
    }
});
const upload = multer({storage: storage})


Router.get("/image", (req, res) => {
    res.render("image");
})

//upload image route
Router.post("/image/upload", upload.single("image"), async (req, res) => {
    const imageid = shortid.generate();
    const {type} = req.body;
    const {imagePath, userid} = req.user;
    
    const uploadImage = "";
    const updateUser = "";

    switch (type) {
        case "user_image":
            setUploadImage = `INSERT INTO images(imageid, image_type, image_path) VALUES ('${imageid}', '${type}', '${imagePath}')`;
            setUpdateUser = `UPDATE TABLE user_details SET user_image='custom' WHERE userid='${userid}'`;
            break;
    
        default: throw new Error();
            break;
    }

    try {
        const uploadImage = await query(setUploadImage);
        if(uploadImage.affectedRows > 0){
            const updateUser = await query(setUpdateUser);
            if(updateUser.affectedRows > 0){
                res.status(200).json({msg: "User image updated Successsfully"});
            } else throw new Error();
        } else throw new Error();
    } catch (error) {
        console.log({uploadImageRoute: error});
        res.status(400).json({msg: "An error has occured"});
    }
});

//delete image route
Router.post("/image/delete/:id", auth, async (req, res) => {
    const imageid = shortid.generate();
    const {type} = req.body;


    //user fs.unlink(path, (err) = {if err consle err and return})
    try {
        
    } catch (error) {
        console.log({deleteImageRoute: error});
        res.status(400).json({msg: "An error has occured"});
    }

});

module.exports = Router;