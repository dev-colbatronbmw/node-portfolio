const express = require("express");
const { check } = require("express-validator");

const contactController = require("../controllers/contactController");

const contactRouter = express.Router();

function router() {
  const {
    getContact,
    postContact,
    // getMyContacts,
    getFeedback,
    getFeedbackShow,
    postFeedback,
  } = contactController();

  contactRouter.route("/").get(getContact);
  contactRouter.route("/Send").post(postContact);
  // contactRouter.route("/MyContacts").get(getMyContacts);
  contactRouter.route("/Feedback/hide").get(getFeedbackShow);
  contactRouter.route("/Feedback/show").get(getFeedback);
  contactRouter.route("/Feedback/").get(getFeedback);
  contactRouter.route("/Feedback").post(postFeedback);
  return contactRouter;
}
module.exports = router;
