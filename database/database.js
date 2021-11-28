const mysql = require("mysql");
require("dotenv").config();

try {
  con = mysql.createConnection({
    
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWD,
      database: process.env.DB_NAME,
    });
  
} catch (error) {
    console.log(error);
}

// try {
//     con = mysql.createConnection({
//         host: process.env.DB_HOST_LOCAL,
//         user: process.env.DB_USER_LOCAL,
//         password: "",
//         database: process.env.DB_NAME_LOCAL,
//     });
// } catch (error) {
//     res.send(error);
// }

con.connect();

module.exports = con;