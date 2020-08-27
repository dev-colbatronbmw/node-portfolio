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
    getRPS,
    getProducts,
    getConnectFour,
    getJuke,
    getWordSearch,
    getCalculator,
    getRecordsRoom,
    getRecordsApi,
    getBattleship,
  } = expController();

  expRouter.route("/").get(getExp);

  // C# Downloads

  expRouter.route("/MovieTicket").get(getMovieTicket);
  expRouter.route("/StudentList").get(getStudent);
  expRouter.route("/UnityGameWindows").get(getUnityGameWindows);
  expRouter.route("/UnityGameMac").get(getUnityGameMac);

  // Ruby 1 Downloads

  expRouter.route("/RPS").get(getRPS);
  expRouter.route("/Products").get(getProducts);
  expRouter.route("/ConnectFour").get(getConnectFour);

  // Ruby 2 Downloads

  expRouter.route("/Juke").get(getJuke);
  expRouter.route("/WordSearch").get(getWordSearch);

  // Java 1 Downloads
  expRouter.route("/Calculator").get(getCalculator);
  // java 2 Downloads
  expRouter.route("/RecordsRoom").get(getRecordsRoom);
  expRouter.route("/RecordsApi").get(getRecordsApi);
  expRouter.route("/Battleship").get(getBattleship);

  return expRouter;
}
module.exports = router;
