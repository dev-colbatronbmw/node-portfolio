const express = require("express");
const { check } = require("express-validator");

const contactController = require("../controllers/contactController");

const contactRouter = express.Router();

function router() {
  const { getContact } = contactController();

  contactRouter.route("/").get(getContact);

  return contactRouter;
}
module.exports = router;
