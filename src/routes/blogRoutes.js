const express = require("express");
// const { check } = require("express-validator");

const blogController = require("../controllers/blogController");

const blogRouter = express.Router();

function router() {
  const { getBlog, getBlogShow } = blogController();

  blogRouter.route("/").get(getBlog);
  blogRouter.route("/:postId").get(getBlogShow);

  function isLoggedIn(req, res, next) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    if (typeof req.session.passport === "undefined") {
      res.redirect("/User/LogIn");
    }

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

  return blogRouter;
}
module.exports = router;
