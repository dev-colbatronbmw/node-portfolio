const express = require("express");
// const { check } = require("express-validator");

const aboutController = require("../controllers/aboutController");

const aboutRouter = express.Router();

function router() {
  const {
    getAbout,
    getFeedback,
    postFeedback,
    getFeedbackShow,
  } = aboutController();

  aboutRouter.route("/").get(getAbout);
  aboutRouter.route("/Feedback").get(getFeedback);
  aboutRouter.route("/Feedback/hide").get(getFeedbackShow);
  aboutRouter.route("/Feedback/show").get(getFeedback);
  aboutRouter.route("/Feedback").post(postFeedback);

  return aboutRouter;
}
module.exports = router;
