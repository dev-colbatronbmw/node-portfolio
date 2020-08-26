const debug = require("debug")("app:nodeController");

function nodeController() {
  debug("node controller: ", "working");

  function getNode(req, res) {
    debug("Get node: ", "Working");

    res.render("node", {});
  }

  return {
    getNode,
  };
}
module.exports = nodeController;
