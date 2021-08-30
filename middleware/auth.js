const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const token = res.cookies.easy_forms_auth_token;
    if(!token) res.status(401).json({msg: "Please Authorize!"});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode.payload.user_details;
        delete req.user.passwords;
        return next();
    } catch (error) {
        console.log({Auth_Middleware: error});
        return res.status(400).json({msg: "An error has occured"});
    }
}

module.exports = auth;