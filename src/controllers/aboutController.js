const debug = require("debug")("app:aboutController");

function aboutController() {
  debug("about controller: ", "working");

  function getAbout(req, res) {
    debug("Get About: ", "Working");
    res.render("about", { csrfToken: req.csrfToken() });
  }

  return {
    getAbout,
  };
}
module.exports = aboutController;
