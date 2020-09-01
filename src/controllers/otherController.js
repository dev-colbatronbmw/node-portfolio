const debug = require("debug")("app:otherController");

function otherController() {
  debug("other controller: ", "working");

  function getOther(req, res) {
    debug("Get other: ", "Working");
    req.session.showFeedback = false;
    var variable = "hide";
    res.render("other", {
      csrfToken: req.csrfToken(),
      Page: "Other",
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

    const show = req.session.showFeedback;
    debug("show feedback: ", req.session.showFeedback);
    res.render("other", {
      csrfToken: req.csrfToken(),
      Page: "Other",
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
    res.render("other", {
      csrfToken: req.csrfToken(),
      Page: "Other",
      showFeedback: show,
      variable: variable,
    });
  }
  return {
    getOther,
    getFeedback,
    postFeedback,
  };
}
module.exports = otherController;
