const express = require("express");
var passport = require("passport");
const debug = require("debug")("app:userRoutes");
const { check } = require("express-validator");
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
const userController = require("../controllers/userController");

const userRouter = express.Router();

function router() {
  const { getUser, getLogIn, getLogout, getRegister } = userController();

  userRouter.get("/Profile", isLoggedIn, getUser);

  userRouter.route("/LogIn").get(getLogIn);

  userRouter.post(
    "/Login",
    passport.authenticate("local-login", {
      successRedirect: "/User/Profile", // redirect to the secure profile section
      failureRedirect: "/User/LogIn", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      console.log("hello");

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect("/User/Register");
    }
  );

  userRouter.route("/Register").get(getRegister);

  // process the signup form
  userRouter.post(
    "/Register",
    passport.authenticate("local-signup", {
      successRedirect: "/User/Profile", // redirect to the secure profile section
      failureRedirect: "/User/Register", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  userRouter.get("/Logout", getLogout);

  function isLoggedIn(req, res, next) {
    var match = async function () {
      await getConnection().query(
        "SELECT * FROM users WHERE UserEmail = ? ",
        [req.session.passport.user.UserEmail],
        function (err, rows) {
          if (req.session.passport.user.UserPassword === rows[0].UserPassword) {
            return true;
          }
          return false;
        }
      );
    };

    var myAuth = function (match) {
      if (
        typeof req.session.passport.user === "undefined" ||
        req.session.passport.user === null
      ) {
        return false;
      }

      // doube check password around this true
      if (match) {
        return true;
      }
      return false;
    };

    debug("my auth?: ", myAuth(match()));
    if (myAuth(match())) return next();

    // if they aren't redirect them to the home page
    res.redirect("/User/LogIn");
  }

  return userRouter;
}
module.exports = router;
