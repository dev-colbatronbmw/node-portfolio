const express = require("express");
const { check } = require("express-validator");

// const router = express.Router();

// router.route("/about").get((req, res) => {
//   res.send("about router");
// });

const homeController = require("../controllers/homeController");

const homeRouter = express.Router();

function router() {
  const { getHome } = homeController();

  homeRouter.route("/").get(getHome);

  return homeRouter;
}
module.exports = router;
