const express = require("express");
// const { check } = require("express-validator");

const nodeController = require("../controllers/nodeController");

const nodeRouter = express.Router();

function router() {
  const { getNode } = nodeController();

  nodeRouter.route("/").get(getNode);

  return nodeRouter;
}
module.exports = router;
