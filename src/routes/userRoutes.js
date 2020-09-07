const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/userController");

const userRouter = express.Router();

function router() {
  const {
    getUser,
    getLogIn,
    postLogIn,
    getRegister,
    postRegister,
    getFeedbackLogIn,
    getFeedbackShowLogIn,
    postFeedbackLogIn,
    getFeedbackRegister,
    getFeedbackShowRegister,
    postFeedbackRegister,
  } = userController();

  userRouter.route("/").get(getUser);
  userRouter.route("/LogIn").get(getLogIn);
  userRouter.route("/LogIn").post(postLogIn);
  userRouter.route("/Register").get(getRegister);
  userRouter.route("/Register").post(postRegister);

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

  return userRouter;
}
module.exports = router;
