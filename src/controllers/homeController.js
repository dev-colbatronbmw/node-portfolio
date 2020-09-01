const debug = require("debug")("app:homeController");

function homeController() {
  debug("home controller: ", "working");

  function getHome(req, res) {
    debug("Get Home: ", "Working");
    req.session.showFeedback = false;
    var variable = "hide";
    req.session.variable = variable;
    res.render("index", { csrfToken: req.csrfToken() });
  }

  return {
    getHome,
  };
}
module.exports = homeController;
