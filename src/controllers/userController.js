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
    debug("user: ", req.session.passport.user);
    res.render("user/profile", {
      csrfToken: req.csrfToken(),
      user: req.session.passport.user
    });
  }
  function getProfileEdit(req, res) {
    debug("Get user: ", "Working");
    debug("user: ", req.session.passport.user);
    res.render("user/edit", {
      csrfToken: req.csrfToken(),
      user: req.session.passport.user
    });
  }
  function getEditPassword(req, res) {
    debug("Get user: ", "Working");
    debug("user: ", req.session.passport.user);
    res.render("user/password", {
      csrfToken: req.csrfToken(),
      user: req.session.passport.user
    });
  }
  function getLogIn(req, res) {
    debug("Get Log In: ", "Working");
    res.render("user/login", {
      csrfToken: req.csrfToken(),
      message: req.flash("loginMessage")
    });
  }
  function getLogout(req, res) {
    req.logout();
    if (typeof req.session.passport !== "undefined") {
      req.session.passport = "undefined";
    }

    res.redirect("/User/LogIn");
  }

  function getRegister(req, res) {
    debug("Get user: ", "Working");
    res.render("user/register", {
      csrfToken: req.csrfToken(),

      message: req.flash("signupMessage")
    });
  }

  return {
    getUser,
    getLogIn,
    getLogout,
    getRegister,
    getProfileEdit,
    getEditPassword
  };
}
module.exports = userController;
