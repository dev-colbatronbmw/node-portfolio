const debug = require("debug")("app:otherController");

function otherController() {
  debug("other controller: ", "working");

  function getOther(req, res) {
    debug("Get other: ", "Working");

    res.render("other", {});
  }

  return {
    getOther,
  };
}
module.exports = otherController;
