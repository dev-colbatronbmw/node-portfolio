const debug = require("debug")("app:userController");
require("dotenv/config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
("use strict");
const passport = require("passport");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

function userController() {
  debug("user controller: ", "working");

  function getUser(req, res) {
    debug("Get user: ", "Working");
    debug("user: ", req.user);
    res.render("user/profile", {
      csrfToken: req.csrfToken(),
      user: req.user,
    });
  }
  function getLogIn(req, res) {
    const Page = "User";
    res.cookie("Page", Page);
    debug("Get user: ", "Working");
    res.render("user/login", {
      csrfToken: req.csrfToken(),
      message: req.flash("loginMessage"),
    });
  }
  function postLogIn(req, res) {
    console.log("hello");
    debug("email at log in post", req.body.email);
    debug("user at log in:", req.user);
    if (req.body.remember) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 3;
    } else {
      req.session.cookie.expires = false;
    }
    res.redirect("/User/Register");
  }
  function getRegister(req, res) {
    debug("Get user: ", "Working");
    res.render("user/register", {
      csrfToken: req.csrfToken(),
      message: req.flash("signupMessage"),
    });
  }
  function postRegister(req, res) {
    debug("Post Register: ", "Working");
    passport.authenticate("local-signup", {
      successRedirect: "/User", // redirect to the secure profile section
      failureRedirect: "/User/Register", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    });
  }

  return {
    getUser,
    getLogIn,
    postLogIn,
    getRegister,
    postRegister,
  };
}
module.exports = userController;
