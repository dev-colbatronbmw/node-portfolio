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
    res.render("about", { csrfToken: req.csrfToken(), Page: "About" });
  }
  function getFeedback(req, res) {
    if (req.session.showFeedback === true) {
      req.session.showFeedback = false;
      variable = "hide";
    } else {
      req.session.showFeedback = true;
      variable = "show";
    }
    req.session.variable = variable;
    debug("variable value:", variable);
    const show = req.session.showFeedback;
    debug("show feedback: ", req.session.showFeedback);
    res.render("about", {
      csrfToken: req.csrfToken(),
      Page: "About",
      showFeedback: show,
      variable: variable,
    });
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

        req.session.showFeedback = false;
        const show = req.session.showFeedback;
        debug("show feedback: ", req.session.showFeedback);
        debug("variable value:", variable);
        res.render("about", {
          csrfToken: req.csrfToken(),
          Page: page,
          showFeedback: show,
          variable: req.session.variable,
        });
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
