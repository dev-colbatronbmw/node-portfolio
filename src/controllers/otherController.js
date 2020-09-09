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
  database: process.env.DATABASE,
});

function getConnection() {
  return pool;
}

function otherController() {
  debug("other controller: ", "working");

  function getOther(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get other: ", "Working");

    res.render("other", {
      csrfToken: req.csrfToken(),
      Page: "Other",
      variable: req.session.variable,
    });
  }

  return {
    getOther,
  };
}
module.exports = otherController;
