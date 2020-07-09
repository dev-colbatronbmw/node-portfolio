const express = require("express");
// const { check } = require("express-validator");

// const router = express.Router();

// router.route("/about").get((req, res) => {
//   res.send("about router");
// });

const aboutController = require("../controllers/aboutController");

const aboutRouter = express.Router();

function router() {
  const { getAbout } = aboutController();

  aboutRouter.route("/").get(getAbout);

  return aboutRouter;
}
module.exports = router;
