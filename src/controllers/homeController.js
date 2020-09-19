const debug = require("debug")("app:homeController");

function homeController() {
  debug("home controller: ", "working");

  function getHome(req, res) {
    debug("Get Home: ", "Working");
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );

    if (typeof req.session.passport !== "undefined") {
      res.render("index", {
        user: req.session.passport.user,
        csrfToken: req.csrfToken()
      });
    } else {
      res.render("index", {
        csrfToken: req.csrfToken()
      });
    }
  }

  return {
    getHome
  };
}
module.exports = homeController;
