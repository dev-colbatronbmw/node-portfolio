const debug = require("debug")("app:expController");

function expController() {
  debug("exp controller: ", "working");

  function getExp(req, res) {
    debug("Get exp: ", "Working");

    res.render("exp", {});
  }

  return {
    getExp,
  };
}
module.exports = expController;
