const debug = require("debug")("app:otherController");
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

function otherController() {
  debug("other controller: ", "working");

  function getOther(req, res) {
    debug("Get other: ", "Working");
    if (typeof req.session.passport !== "undefined") {
      res.render("other", {
        csrfToken: req.csrfToken(),
        user: req.session.passport.user
      });
    } else {
      res.render("other", {
        csrfToken: req.csrfToken()
      });
    }
  }

  return {
    getOther
  };
}
module.exports = otherController;
