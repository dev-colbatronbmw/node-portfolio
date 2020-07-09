const debug = require("debug")("app:contactController");

function contactController() {
  debug("contact controller: ", "working");

  function getContact(req, res) {
    debug("Get Contact: ", "Working");
    // res.send("about test");
    res.render("contact", {});
  }

  return {
    getContact,
  };
}
module.exports = contactController;
