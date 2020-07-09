const debug = require("debug")("app:homeController");

function homeController() {
  debug("home controller: ", "working");

  function getHome(req, res) {
    debug("Get Home: ", "Working");

    res.render("index", {});
  }

  return {
    getHome,
  };
}
module.exports = homeController;
