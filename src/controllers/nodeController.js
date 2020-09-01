const session = require("express-session");

const debug = require("debug")("app:nodeController");
// const csurf = require("csurf");
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

function nodeController() {
  debug("node controller: ", "working");

  function getNode(req, res) {
    debug("Get node: ", "Working");
    res.render("node", {
      csrfToken: req.csrfToken(),
      Page: "Node",
      variable: req.session.variable,
    });
  }
  function getFeedback(req, res) {
    if (req.session.variable === "hide") {
      req.session.variable = "show";
    } else {
      req.session.variable = "hide";
    }
    debug("variable value:", req.session.variable);
    debug("show feedback: ", req.session.showFeedback);
    res.redirect("/Node");
  }

  function postFeedback(req, res) {
    const email = req.body.email;
    const feedback = req.body.comment;
    const page = "Node";
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
        res.redirect("/Node");
      }
    );
  }

  return {
    getNode,
    getFeedback,
    postFeedback,
  };
}
module.exports = nodeController;
