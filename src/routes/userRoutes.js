const express = require("express");
var passport = require("passport");
const { check } = require("express-validator");

const userController = require("../controllers/userController");

const userRouter = express.Router();

function router() {
  const {
    // getUser,
    getLogIn,
    postLogIn,
    getRegister,
    postRegister,
    postFeedbackRegister,
  } = userController();

  // userRouter.get("/").get(getUser);

  userRouter.get("/", isLoggedIn, function (req, res) {
    res.render("user/profile", {
      user: req.user, // get the user out of session and pass to template
    });
  });
  userRouter.get("/Profile", isLoggedIn, function (req, res) {
    res.render("user/profile", {
      user: req.user, // get the user out of session and pass to template
    });
  });

  // userRouter.get("/Profile").get(getUser);
  userRouter.route("/LogIn").get(getLogIn);

  userRouter.post(
    "/Login",
    passport.authenticate("local-login", {
      successRedirect: "/", // redirect to the secure profile section
      failureRedirect: "/User/LogIn", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
    function (req, res) {
      console.log("hello");

      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect("/User/Register");
    }
  );

  userRouter.route("/Register").get(getRegister);
  // userRouter.route("/Register").post(postRegister);

  // app.get('/signup', function(req, res) {
  // 	// render the page and pass in any flash data if it exists
  // 	res.render('signup.ejs', { message: req.flash('signupMessage') });
  // });

  // process the signup form
  userRouter.post(
    "/Register",
    passport.authenticate("local-signup", {
      successRedirect: "/User/Login", // redirect to the secure profile section
      failureRedirect: "/User/Register", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  userRouter.get("/Logout", function (req, res) {
    req.logout();
    res.redirect("/Node");
  });

  //-----------feedback----------
  userRouter.route("/LogIn/Feedback/hide").get(getFeedbackShowLogIn);
  userRouter.route("/LogIn/Feedback/show").get(getFeedbackLogIn);
  userRouter.route("/LogIn/Feedback").get(getFeedbackLogIn);
  userRouter.route("/LogIn/Feedback").post(postFeedbackLogIn);

  userRouter.route("/Register/Feedback/hide").get(getFeedbackShowRegister);
  userRouter.route("/Register/Feedback/show").get(getFeedbackRegister);
  userRouter.route("/Register/Feedback").get(getFeedbackRegister);
  userRouter.route("/Register/Feedback").post(postFeedbackRegister);
  //-----------end feedback----------

  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect("/User");
  }

  return userRouter;
}
module.exports = router;
