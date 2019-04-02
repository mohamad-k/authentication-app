const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/", (req, res) => res.render("dashboard"));
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));
router.post("/register", (req, res) => {
  const { firstname, lastname, email, password, password2, gender } = req.body;

  let errors = [];
  if ((!firstname || !lastname || !email || !password, !password2, !gender)) {
    errors.push({ msg: "fill in all fields" });
  }
  if (password !== password2) {
    errors.push({ msg: "password not match" });
  }
  if (password.length < 8) {
    errors.push({ msg: "password should be at least 8 characters" });
  }
  if (password.search(/[a-z]/i) < 0 || password.search(/[0-9]/) < 0) {
    errors.push({
      msg: "password should contain at least one letter and one digit"
    });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstname,
      lastname,
      email,
      password,
      password2,
      gender
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "This Email is already exist" });
        res.render("register", {
          errors,
          firstname,
          lastname,
          email,
          password,
          password2,
          gender
        });
      } else {
        let newUser = new User({
          firstname,
          lastname,
          email,
          password,
          gender
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                req.flash("success_msg", "registeration  seccessfull");
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
        //save newUser in database
      }
    });
  }
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});
module.exports = router;
