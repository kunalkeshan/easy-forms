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
const form_edit = require("./routes/form_edit");
const form_create = require("./routes/form_create");
const form_retrieve = require("./routes/form_retrieve");
const routes = require("./routes/routes");

app.use("/", routes);
app.use("/", register);
app.use("/", user);
app.use("/", form_edit);
app.use("/", form_create);
app.use("/", form_retrieve);

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
