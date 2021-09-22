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
        if(req.body.type === "user_image"){
            req.user.image_path = `/images/user/${FILENAME}`;
        } else if (req.body.type === "question"){
            //for user image
            req.body.image_path = `/images/question/${FILENAME}`;
        } else if(req.body.type === "response"){
            //for question and response
            req.body.imagePathFQR = `/images/response/${FILENAME}`;
        } else cb( new Error("Provide a valid type"));
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
    const {type, imagePathFQR} = req.body;
    console.log(req.body)
    /*
        imagePathFQR = for question and response;
        image_path = for user images
    */
    
    let setUploadImage = "";
    let setUpdateUser = "";

    try {
        if(type === "user_image"){
            const {userid, image_path} = req.user;
            //Queries
            setUploadImage = `INSERT INTO images(imageid, image_type, image_path) VALUES ('${imageid}', '${type}', '${image_path}');`;
            setUpdateUser = `UPDATE TABLE user_details SET user_image='custom' WHERE userid='${userid}';`;

            const uploadImage = await query(setUploadImage);
            if(uploadImage.affectedRows > 0){
                const updateUser = await query(setUpdateUser);
                if(updateUser.affectedRows > 0){
                    res.status(200).json({msg: "User image updated Successsfully", image_path});
                } else throw new Error();
            } else throw new Error();

        } else if(type === "question"){
            //Queries
            setUploadImage = `INSERT INTO images(imageid, image_type, image_path) VALUES('${imageid}', '${type}', '${imagePathFQR}');`

            const uploadImage = await query(setUploadImage);
            if(uploadImage.affectedRows > 0){
                res.status(200).json({msg: "Question Image uploaded successfully", imagePathFQR})
            } else throw new Error();

        } else if(type === "response"){
            //Queries
            setUploadImage = `INSERT INTO images(imageid, image_type, image_path) VALUES('${imageid}', '${type}', '${imagePathFQR}');`

            const uploadImage = await query(setUploadImage);
            if(uploadImage.affectedRows > 0){
                res.status(200).json({msg: "Response Image uploaded successfully", imagePathFQR})
            } else throw new Error();

        } else res.status(400).json({msg: "Provide a valid type!"});
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