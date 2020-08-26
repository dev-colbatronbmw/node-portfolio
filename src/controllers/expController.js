const debug = require("debug")("app:expController");

function expController() {
  debug("exp controller: ", "working");

  function getExp(req, res) {
    debug("Get exp: ", "Working");

    res.render("exp", {});
  }
  function getMovieTicket(req, res) {
    debug("Get Movie ticket: ", "Working");
    const file = "./projects/cSharp/MovieObj.zip";
    res.download(file);
  }
  function getStudent(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/cSharp/Student-2.zip";
    res.download(file);
  }
  function getUnityGameMac(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/cSharp/transport1.zip";
    res.download(file);
  }
  function getUnityGameWindows(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/cSharp/TransportGame.zip";
    res.download(file);
  }
  return {
    getExp,
    getMovieTicket,
    getStudent,
    getUnityGameWindows,
    getUnityGameMac,
  };
}
module.exports = expController;
