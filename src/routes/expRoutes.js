const express = require("express");
// const { check } = require("express-validator");

const expController = require("../controllers/expController");

const expRouter = express.Router();

function router() {
  const { getExp } = expController();

  expRouter.route("/").get(getExp);

  return expRouter;
}
module.exports = router;
