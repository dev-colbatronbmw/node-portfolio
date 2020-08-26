const express = require("express");
// const { check } = require("express-validator");

const otherController = require("../controllers/otherController");

const otherRouter = express.Router();

function router() {
  const { getOther } = otherController();

  otherRouter.route("/").get(getOther);

  return otherRouter;
}
module.exports = router;
