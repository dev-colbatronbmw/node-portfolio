const express = require("express");
// const { check } = require("express-validator");

const nodeController = require("../controllers/nodeController");

const nodeRouter = express.Router();

function router() {
  const { getNode, postFeedback } = nodeController();

  nodeRouter.route("/").get(getNode);

  nodeRouter.route("/Feedback").post(postFeedback);

  return nodeRouter;
}
module.exports = router;
