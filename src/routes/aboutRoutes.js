const express = require("express");
// const { check } = require("express-validator");

const aboutController = require("../controllers/aboutController");

const aboutRouter = express.Router();

function router() {
  const { getAbout, getFeedback, postFeedback } = aboutController();

  aboutRouter.route("/").get(getAbout);
  aboutRouter.route("/Feedback").get(getFeedback);
  aboutRouter.route("/Feedback").post(postFeedback);

  return aboutRouter;
}
module.exports = router;
