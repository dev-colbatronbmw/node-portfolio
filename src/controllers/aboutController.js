const debug = require("debug")("app:aboutController");
const session = require("express-session");
require("dotenv/config");
const mysql = require("mysql");
("use strict");
const nodemailer = require("nodemailer");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE
});

function getConnection() {
  return pool;
}

function aboutController() {
  debug("about controller: ", "working");

  function getAbout(req, res) {
    debug("Get About: ", "Working");

    if (typeof req.session.passport !== "undefined") {
      res.render("about", {
        user: req.session.passport.user,
        csrfToken: req.csrfToken()
      });
    }
    res.render("about", {
      csrfToken: req.csrfToken()
    });
  }

  return {
    getAbout
  };
}
module.exports = aboutController;
