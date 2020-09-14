const debug = require("debug")("app:homeController");

function homeController() {
  debug("home controller: ", "working");

  function getHome(req, res) {
    debug("Get Home: ", "Working");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    if (typeof req.session.passport !== "undefined") {
      res.render("index", {
        user: req.session.passport.user,
        csrfToken: req.csrfToken()
      });
    }
    res.render("index", {
      csrfToken: req.csrfToken()
    });
  }

  return {
    getHome
  };
}
module.exports = homeController;
