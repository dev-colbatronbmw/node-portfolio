const express = require("express");
const { check } = require("express-validator");

const contactController = require("../controllers/contactController");

const contactRouter = express.Router();

function router() {
  const {
    getContact,
    postContact,
    // getMyContacts,
  } = contactController();

  contactRouter.route("/").get(getContact);
  contactRouter.route("/Send").post(postContact);
  // contactRouter.route("/MyContacts").get(getMyContacts);

  return contactRouter;
}
module.exports = router;
