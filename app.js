const express = require("express");
const app = express();
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

//Imporing All Routes
const register = require("./routes/register");
const user = require("./routes/user");
const form_admin = require("./routes/form_admin");
const form_client = require("./routes/form_client");
const routes = require("./routes/routes");

app.use("/", routes);
app.use("/", register);
app.use("/", user);
app.use("/", form_admin);
app.use("/", form_client);

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
