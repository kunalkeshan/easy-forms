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
        cb(null, 'public/images/assets');
    },
    filename: function(req, file, cb){
        const FILENAME = Date.now() + "_" + file.originalname;
        req.body.imagePath = `/images/assets/${FILENAME}`
        cb(null, FILENAME);
    }
});
const upload = multer({storage: storage})


Router.get("/image", (req, res) => {
    res.render("image");
})

//upload image route
Router.post("/image/upload", upload.single("image"), async (req, res) => {
    const {imagePath} = req.body;
    if(imagePath){
        // res.redirect(`/image/upload/db?image_path=${JSON.stringify(imagePath)}`);
        res.send("Works")
    } else {
        res.status(400).json({msg: "Uploading Error"});
    }
});

Router.post("/image/upload/db?", async (req, res) => {
    const imageid = shortid.generate();
    const {userid} = req.user;
    const {type, imagePath} = req.body;

    //Queries
    const setUploadImage = `INSERT INTO image(imageid, image_type, image_path) VALUES('${imageid}', '${type}', '${imagePath}');`;
    const setUpadteUser = `UPDATE user_details SET image_type='custom', image_path='${imagePath}' WHERE userid='${userid}';`;
    

    try {
        const uploadImage = await query(setUploadImage);
        if(uploadImage.affectedRows > 0){
            if(type === "user_image"){
                if(uploadImage.affectedRows > 0){
                    const updateUser = await query(setUpadteUser);
                    if(updateUser.affectedRows > 0){
                        res.status(200).json({msg: "DB Updated"});
                    } else throw new Error();
                }
            } else if(type === "question"){

            } else if(type === "response"){

            } else res.status(400).json({msg: "Please enter valid type"});
        } else throw new Error();

    } catch (error) {
        console.log({updateDBImageRoute: error});
        res.status(400).json({msg: "An error has occured!"});
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