const express = require("express");
// const { check } = require("express-validator");

const otherController = require("../controllers/otherController");

const otherRouter = express.Router();

function router() {
  const { getOther, getFeedback, postFeedback } = otherController();

  otherRouter.route("/").get(getOther);
  otherRouter.route("/Feedback").get(getFeedback);
  otherRouter.route("/Feedback").post(postFeedback);

  return otherRouter;
}
module.exports = router;
