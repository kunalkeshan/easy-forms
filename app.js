const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path")
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.json());
// app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Imporing All Routes
const register = require("./routes/register");
const user = require("./routes/user");
const form_edit = require("./routes/form_edit");
const form_create = require("./routes/form_create");
const form_retrieve = require("./routes/form_retrieve");
const form_response = require("./routes/form_response");
const form_delete = require("./routes/form_delete");
const images = require("./routes/images");
const routes = require("./routes/routes");

app.use("/", routes);
app.use("/", register);
app.use("/", user);
app.use("/", form_edit);
app.use("/", form_create);
app.use("/", form_retrieve);
app.use("/", form_response);
app.use("/", form_delete);
app.use("/", images);

app.use((req, res) => {
  const page = {
    link: "404", 
    title: "404! No Page Found!", 
    isLoggedIn: false
  }
  const isAuthenticated = req.cookies.easy_forms_auth_token;
  if(isAuthenticated) page.isLoggedIn = true;
  res.status(404).render("404", {page});
});

const PORT = process.env.PORT;

app.listen(PORT, (req, res) => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
