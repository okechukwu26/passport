const express = require("express");
const partials = require("express-partials");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//passport config
require("./config/passport")(passport);

//DB config
const db = require("./config/keys").MONGOURL;

//db connect
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongoDB connected"))
  .catch(() => console.log(err));

const port = process.env.PORT || 5000;
//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(partials());
app.use(express.static("public"));
//body-parser
app.use(express.urlencoded({ extended: false }));
//Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());
//global var
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

//routes
app.use("/users", require("./routes/user"));
app.use("/", require("./routes/index"));

app.listen(port, console.log(`server is up on port ${port}`));
