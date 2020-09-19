const debug = require("debug")("app:userController");
require("dotenv/config");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
("use strict");
const passport = require("passport");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv/config");
const mysql = require("mysql");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE
});

function getConnection() {
  return pool;
}

function userController() {
  debug("user controller: ", "working");

  function getUser(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get user: ", "Working");
    debug("user: ", req.session.passport.user);

    var blog = [];
    var comments = [];
    var likes = [];
    getConnection().query("SELECT * FROM users", [], function (err, rows) {
      if (err) {
        res.redirect("back");
        return;
      }
      users = rows.map(row => {
        return {
          userId: row.Id,
          userName: row.UserName
        };
      });

      getConnection().query("SELECT * FROM blog", [], function (err, rows) {
        if (err) {
          res.redirect("back");
          return;
        }

        //code modification
        blog = rows.map(row => {
          return {
            postId: row.postId,
            title: row.title,
            content: row.content,
            image1: row.image1,
            image2: row.image2,
            image3: row.image3,
            published: row.published,
            userId: row.userId
          };
        });

        // debug("posts in connection", blog);

        getConnection().query("SELECT * FROM blogComments", [], function (
          err,
          rows
        ) {
          if (err) {
            res.redirect("back");
            return;
          }

          //code modification
          comments = rows.map(row => {
            return {
              commentId: row.commentId,
              postId: row.postId,
              content: row.content,
              userId: row.userId
            };
          });

          getConnection().query("SELECT * FROM blogLikes", [], function (
            err,
            rows
          ) {
            if (err) {
              res.redirect("back");
              return;
            }

            //code modification
            likes = rows.map(row => {
              return {
                likeId: row.likeId,
                postId: row.postId,
                userId: row.userId
              };
            });

            // debug("posts", blog);
            // debug("comments", comments);
            // debug("likes", likes);

            if (typeof req.session.passport !== "undefined") {
              res.render("user/profile", {
                csrfToken: req.csrfToken(),
                user: req.session.passport.user,
                users: users,
                blog: blog,
                comments: comments,
                likes: likes
              });
            } else {
              res.render("user/profile", {
                csrfToken: req.csrfToken(),
                users: users,
                blog: blog,
                comments: comments,
                likes: likes
              });
            }
          });
        });
      });
    });
  }
  function getProfileEdit(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get user: ", "Working");
    debug("user: ", req.session.passport.user);
    res.render("user/edit", {
      csrfToken: req.csrfToken(),
      user: req.session.passport.user
    });
  }
  function getEditPassword(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get user: ", "Working");
    debug("user: ", req.session.passport.user);
    res.render("user/password", {
      csrfToken: req.csrfToken(),
      user: req.session.passport.user
    });
  }
  function getLogIn(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get Log In: ", "Working");
    res.render("user/login", {
      csrfToken: req.csrfToken(),
      message: req.flash("loginMessage")
    });
  }
  function getLogout(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.logout();
    if (typeof req.session.passport !== "undefined") {
      req.session.passport = "undefined";
    }

    res.redirect("back");
  }

  function getRegister(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get user: ", "Working");
    res.render("user/register", {
      csrfToken: req.csrfToken(),

      message: req.flash("signupMessage")
    });
  }

  return {
    getUser,
    getLogIn,
    getLogout,
    getRegister,
    getProfileEdit,
    getEditPassword
  };
}
module.exports = userController;
