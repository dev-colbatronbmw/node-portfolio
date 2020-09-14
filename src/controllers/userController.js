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
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get user: ", "Working");
    debug("user: ", req.session.passport.user);
    if (typeof req.session.passport !== "undefined") {
      res.render("user/profile", {
        csrfToken: req.csrfToken(),
        user: req.session.passport.user
      });
    } else {
      res.render("user/profile", {
        csrfToken: req.csrfToken()
      });
    }
  }
  function getProfileEdit(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get user: ", "Working");
    debug("user: ", req.session.passport.user);
    res.render("user/edit", {
      csrfToken: req.csrfToken(),
      user: req.session.passport.user
    });
  }
  function getEditPassword(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get user: ", "Working");
    debug("user: ", req.session.passport.user);
    res.render("user/password", {
      csrfToken: req.csrfToken(),
      user: req.session.passport.user
    });
  }
  function getLogIn(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get Log In: ", "Working");
    res.render("user/login", {
      csrfToken: req.csrfToken(),
      message: req.flash("loginMessage")
    });
  }
  function getLogout(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.logout();
    if (typeof req.session.passport !== "undefined") {
      req.session.passport = "undefined";
    }

    res.redirect("/User/LogIn");
  }

  function getRegister(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
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
