const express = require("express");
// const { check } = require("express-validator");

const expController = require("../controllers/expController");

const expRouter = express.Router();

function router() {
  const {
    getExp,
    getMovieTicket,
    getStudent,
    getUnityGameWindows,
    getUnityGameMac,
  } = expController();

  expRouter.route("/").get(getExp);
  expRouter.route("/MovieTicket").get(getMovieTicket);
  expRouter.route("/StudentList").get(getStudent);
  expRouter.route("/UnityGameWindows").get(getUnityGameWindows);
  expRouter.route("/UnityGameMac").get(getUnityGameMac);
  return expRouter;
}
module.exports = router;
