const session = require("express-session");

const debug = require("debug")("app:nodeController");
// const csurf = require("csurf");

function nodeController() {
  debug("node controller: ", "working");

  function getNode(req, res) {
    debug("Get node: ", "Working");
    req.session.showFeedback = false;
    var variable = "hide";
    debug("show feedback: ", req.session.showFeedback);
    debug("variable value:", variable);
    res.render("node", {
      csrfToken: req.csrfToken(),
      Page: "Node",
      showFeedback: req.session.feedback,
      variable: variable,
    });
  }
  function getFeedback(req, res) {
    if (req.session.showFeedback === true) {
      req.session.showFeedback = false;
      variable = "hide";
    } else {
      req.session.showFeedback = true;
      variable = "show";
    }
    debug("variable value:", variable);
    const show = req.session.showFeedback;
    debug("show feedback: ", req.session.showFeedback);
    res.render("node", {
      csrfToken: req.csrfToken(),
      Page: "Node",
      showFeedback: show,
      variable: variable,
    });
  }

  function postFeedback(req, res) {
    // make insert query
    var variable = "hide";
    req.session.showFeedback = false;
    const show = req.session.showFeedback;
    debug("show feedback: ", req.session.showFeedback);
    debug("variable value:", variable);
    res.render("node", {
      csrfToken: req.csrfToken(),
      Page: "Node",
      showFeedback: show,
      variable: variable,
    });
  }

  return {
    getNode,
    getFeedback,
    postFeedback,
  };
}
module.exports = nodeController;
