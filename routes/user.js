const express = require("express");
const router = express.Router();
const passport = require("passport");
//user model
const User = require("../model/User");
const bcrypt = require("bcryptjs");
//login page
router.get("/login", (req, res) => {
  res.render("login");
});
//register page
router.get("/register", (req, res) => {
  res.render("register");
});
//register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //check required field
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all field" });
  }
  //password match
  if (password !== password2) {
    errors.push({ msg: "passwords do not match" });
  }
  //check password length
  if (password.length < 6) {
    errors.push({ msg: "passowrd should be atleast 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //validate user
    User.findOne({ email }).then((user) => {
      if (user) {
        //user exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const user = new User({
          name,
          email,
          password,
        });
        //hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            //save user
            user.password = hash;
            user
              .save()
              .then(() => {
                req.flash(
                  "success_msg",
                  "you are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});
//login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});
//logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "you have logout ");
  res.redirect("/users/login");
});

module.exports = router;
