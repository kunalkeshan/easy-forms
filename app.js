const express = require("express");
const app = express();
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.end("Initialized!");
});

const register = require("./routes/register");

app.use("/", register)

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
