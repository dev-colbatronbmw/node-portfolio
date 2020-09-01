const debug = require("debug")("app:expController");

const session = require("express-session");
require("dotenv/config");
const mysql = require("mysql");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE,
});

function getConnection() {
  return pool;
}

function expController() {
  debug("exp controller: ", "working");

  function getExp(req, res) {
    debug("Get exp: ", "Working");

    res.render("exp", {
      Page: "Exp",
      csrfToken: req.csrfToken(),
      variable: req.session.variable,
    });
  }

  function getResume(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/Colby_Holmstead_-_Full_Stack_Developer.pdf";
    res.download(file);
  }

  // C# Downloads
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
  // Ruby Downloads
  function getRPS(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ruby/one/rps.zip";
    res.download(file);
  }
  function getProducts(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ruby/one/products.zip";
    res.download(file);
  }
  function getConnectFour(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ruby/one/connectFour.zip";
    res.download(file);
  }
  function getJuke(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ruby/two/Jukebox.zip";
    res.download(file);
  }
  function getWordSearch(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ruby/two/wordsearch.zip";
    res.download(file);
  }

  // Java Downloads
  function getCalculator(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/java/Calculator-4.zip";
    res.download(file);
  }
  function getRecordsRoom(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/java/Records.zip";
    res.download(file);
  }
  function getRecordsApi(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/java/RecordsWithApi.zip";
    res.download(file);
  }
  function getBattleship(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/java/Battleship-2.zip";
    res.download(file);
  }

  // iOS Downloads

  function getRoShamBillQ1(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ios/one/FinalProject.zip";
    res.download(file);
  }
  function getRoShamBillQ2(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ios/two/FinalProject.zip";
    res.download(file);
  }
  function getPetTracker(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ios/two/pet-tracker.zip";
    res.download(file);
  }
  function getCaseMatch(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/ios/Case Match.zip";
    res.download(file);
  }

  // node Downloads

  function getPlankCooking(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/node/plankcooking.zip";
    res.download(file);
  }
  function getNodeApi(req, res) {
    debug("Get Student: ", "Working");
    const file = "./projects/node/nodeapi.zip";
    res.download(file);
  }
  function getFeedback(req, res) {
    if (req.session.variable === "hide") {
      req.session.variable = "show";
    } else {
      req.session.variable = "hide";
    }
    res.redirect("/Exp");
  }

  function postFeedback(req, res) {
    // make insert query
    const email = req.body.email;
    const feedback = req.body.comment;
    const page = "exp";
    const good = 1;
    const complete = 0;

    const qString =
      "INSERT INTO feedback ( feedback, Email, Page, Good, Complete) Values (?, ?, ?, ?, ?)";
    getConnection().query(
      qString,
      [email, feedback, page, good, complete],
      (err, results, fields) => {
        if (err) {
          console.log("failed to insert product" + err);
          res.sendStatus(500);
          return;
        }

        req.session.variable = "hide";
        res.redirect("/Exp");
      }
    );
  }

  return {
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
    getRoShamBillQ1,
    getRoShamBillQ2,
    getPetTracker,
    getCaseMatch,
    getPlankCooking,
    getNodeApi,
    getResume,
    getFeedback,
    postFeedback,
  };
}
module.exports = expController;
