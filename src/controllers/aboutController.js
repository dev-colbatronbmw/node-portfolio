const debug = require("debug")("app:aboutController");
const session = require("express-session");
require("dotenv/config");
const mysql = require("mysql");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE,
});

function getConnection() {
  return pool;
}

function aboutController() {
  debug("about controller: ", "working");

  function getAbout(req, res) {
    debug("Get About: ", "Working");
    res.render("about", {
      csrfToken: req.csrfToken(),
      Page: "About",
      variable: req.session.variable,
    });
  }
  function getFeedback(req, res) {
    if (req.session.variable === "hide") {
      req.session.variable = "show";
    } else {
      req.session.variable = "hide";
    }
    res.redirect("/About");
  }

  function postFeedback(req, res) {
    // make insert query
    const email = req.body.email;
    const feedback = req.body.comment;
    const page = "About";
    const good = 1;
    const complete = 0;

    const qString =
      "INSERT INTO feedback ( feedback, Email, Page, Good, Complete) Values (?, ?, ?, ?, ?)";
    getConnection().query(
      qString,
      [email, feedback, page, good, complete],
      (err, results, fields) => {
        if (err) {
          console.log("failed to insert product" + err);
          res.sendStatus(500);
          return;
        }
        req.session.variable = "hide";
        res.redirect("/About");
      }
    );
  }

  return {
    getAbout,
    getFeedback,
    postFeedback,
  };
}
module.exports = aboutController;
