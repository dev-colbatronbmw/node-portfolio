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
const { reset } = require("nodemon");

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
                likes: likes,
                message: req.flash("loginMessage")
              });
            } else {
              res.render("user/profile", {
                csrfToken: req.csrfToken(),
                users: users,
                blog: blog,
                comments: comments,
                likes: likes,
                message: req.flash("loginMessage")
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
      user: req.session.passport.user,
      message: req.flash("errorMessage")
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

  function postEditPassword(req, res) {
    const user = req.session.passport.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    debug("user for password update", user);
    getConnection().query(
      "SELECT * FROM users WHERE UserEmail = ?",
      [user.UserEmail],
      function (err, rows) {
        // debug("user: ", rows[0]);
        if (err) {
          req.flash("errorMessage", err);
          res.redirect("back");
        }

        // if the user is found but the password is wrong
        if (!bcrypt.compareSync(oldPassword, rows[0].UserPassword)) {
          req.flash("errorMessage", "Oops! Wrong original password");
          res.redirect("back");
        } else {
          // create the loginMessage and save it to session as flashdata

          // all is well, return successful user
          // debug("user about to log in: ", rows[0]);

          var newHashedPassword = {
            password: bcrypt.hashSync(newPassword, 10, null) // use the generateHash function in our user model
          };

          getConnection().query(
            "UPDATE users SET UserPassword = ? WHERE UserEmail = ?",
            [newHashedPassword.password, user.UserEmail],
            function (err, rows) {
              // debug("user: ", rows[0]);
              if (err) {
                debug("error", err);
                req.flash("errorMessage", err);
                res.redirect("back");
              } else {
                // ----------------------email registrant -------------------
                async function email() {
                  // Generate test SMTP service account from ethereal.email
                  // Only needed if you don't have a real mail account for testing
                  let testAccount = await nodemailer.createTestAccount();

                  // create reusable transporter object using the default SMTP transport
                  let transporter = nodemailer.createTransport({
                    host: "smtp.dreamhost.com",
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                      user: process.env.EMAIL_USER, // generated ethereal user
                      pass: process.env.EMAIL_PASSWORD // generated ethereal password
                    }
                  });

                  // send mail with defined transport object
                  let info = await transporter.sendMail({
                    from: '"Colby Holmstead" <dev@colbyholmstead.com>', // sender address
                    to: `${user.UserEmail}`, // list of receivers
                    subject: "Password Has Changed", // Subject line
                    text: `
                    ${user.UserName}, Your password has been changed.\n
                     If you were not the one who changed your password plase contact admin at dev@colbyholmstead.com \n
                    I will get back to you as soon as possible.
                    `, // plain text body
                    html: `<p> 
    
                    ${user.UserName},</p>
                     <p>Your password has been changed.</p> 
                     <p> If you were not the one who changed your password plase contact admin at dev@colbyholmstead.com</p>
                    <p> I will get back to you as soon as possible. </p>` // html body
                  });
                }

                email().catch(console.error);

                req.flash("loginMessage", "Password Updated");
                res.redirect("/User/Profile");
              }
            }
          );
        }
      }
    );
  }

  function getForgotPassword(req, res) {
    debug("get forgot password");

    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get user: ", "Working");
    // debug("user: ", req.session.passport.user);
    res.render("user/forgot-password-email", {
      csrfToken: req.csrfToken(),
      // user: req.session.passport.user,
      message: req.flash("errorMessage")
    });
  }
  function postForgotPassword(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get postForgotPassword: ", "Working");

    const email = req.body.email;
    debug("email for reset", email);
    getConnection().query(
      "SELECT * FROM users WHERE UserEmail = ?",
      [email],
      (err, rows) => {
        if (err) {
          req.flash("errorMessage", "Email not found");
          res.redirect("back");
        } else {
          users = rows.map(row => {
            return {
              userId: row.Id,
              userName: row.UserName,
              userEmail: row.UserEmail
            };
          });
          const user = users[0];

          if (typeof users[0] === "undefined") {
            req.flash("errorMessage", "That user does not exist");
            res.redirect("/User/Forgot/Password");
          } else {
            // debug("users[0] from database", users[0]);
            // debug("email from database", users[0].userEmail);
            if (users[0].userEmail === email) {
              // do the thing
              var myRegex = /\/|\.|\?/g;
              var regex = new RegExp(myRegex);
              var token = bcrypt.hashSync(email, 10, null);

              var match = regex.test(token);
              // debug("match: ", match);
              // debug("token before loop: ", token);
              while (match) {
                while (match) {
                  while (match) {
                    token = bcrypt.hashSync(email, 10, null);
                    match = regex.test(token);
                    // debug("match center: ", match);
                    // debug("token reset center: ", token);
                  }
                  match = regex.test(token);
                  // debug("match after center: ", match);
                  // debug("token reset after center: ", token);
                }
                match = regex.test(token);
                // debug("match last: ", match);
                // debug("token reset last: ", token);
              }
              debug("match selected: ", match);
              debug("token selected: ", token);

              // check token for bad chars if it has any reset

              req.flash(
                "loginMessage",
                "Email Sent! It may take a few minutes to arrive."
              );
              // add token and email to database

              getConnection().query(
                " INSERT INTO resetTokens (resetEmail, resetToken) VALUES (?, ?)",
                [email, token],
                (err, results, fields) => {
                  if (err) {
                    req.flash(
                      "errorMessage",
                      "Error getting reset please contact Colby"
                    );
                    res.redirect("back");
                  } else {
                    //nodemailer build stringified token

                    // ----------------------email registrant -------------------
                    async function email() {
                      // Generate test SMTP service account from ethereal.email
                      // Only needed if you don't have a real mail account for testing
                      let testAccount = await nodemailer.createTestAccount();

                      // create reusable transporter object using the default SMTP transport
                      let transporter = nodemailer.createTransport({
                        host: "smtp.dreamhost.com",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                          user: process.env.EMAIL_USER, // generated ethereal user
                          pass: process.env.EMAIL_PASSWORD // generated ethereal password
                        }
                      });
                      // debug("user being emailed: ", user);
                      // send mail with defined transport object
                      let info = await transporter.sendMail({
                        from: '"Colby Holmstead" <dev@colbyholmstead.com>', // sender address
                        to: `${user.userEmail}`, // list of receivers
                        subject: "Password Change Link", // Subject line
                        text: `
              ${user.userName}, To change your password plaese paste this URL into your browser: http://localhost:4000/User/Forgot/Password/${token} \n
              If you were not the one who changed your password plase contact Colby at dev@colbyholmstead.com \n
              I will get back to you as soon as possible.
              `, // plain text body
                        html: `<p>

              ${user.userName},</p>
               <p>To change your password plaese paste this URL into your browser: http://localhost:4000/User/Forgot/Password/${token}</p>
               <p> If you were not the one who changed your password plase contact Colby at dev@colbyholmstead.com</p>
              <p> I will get back to you as soon as possible. </p>` // html body
                      });
                    }

                    email().catch(console.error);

                    res.redirect("/User/LogIn");
                  }
                }
              );
            } else {
              req.flash("errorMessage", "Email not found");
              res.redirect("back");
            }
          }
        }
      }
    );
  }
  function getForgotPasswordReset(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get getForgotPasswordReset: ", "Working");

    // if token is not in database reRoute to log in scren with error message
    // if the token does exsist let them update the password.
    // after new password is entered log them out with a new log in message.
    const token = req.params.token;

    debug("token on reset", token);
    getConnection().query(
      "SELECT * FROM resetTokens WHERE resetToken = ?",
      [token],
      function (err, rows) {
        if (err) {
          debug("error:", err);
          req.flash(
            "errorMessage",
            "That link no longer works please request a new one."
          );
          res.redirect("/User/LogIn");
        }

        var reset = rows.map(row => {
          return {
            email: row.resetEmail
          };
        });

        if (typeof reset[0] === "undefined") {
          req.flash(
            "loginMessage",
            "That link no longer works please request a new one."
          );
          res.redirect("/User/LogIn");
        } else {
          // debug("resetEmail: ", reset[0].email);

          getConnection().query(
            "Select * FROM users WHERE UserEmail = ?",
            [reset[0].email],
            function (err, rows) {
              if (err) {
                debug("error:", err);
                req.flash("loginMessage", "That user does not exist");
                res.redirect("/User/LogIn");
              }
              users = rows.map(row => {
                return {
                  userId: row.Id,
                  userName: row.UserName,
                  userEmail: row.UserEmail
                };
              });

              // delete the token from the database
              debug("user token to delete: ", users[0]);
              getConnection().query(
                "DELETE FROM resetTokens WHERE resetEmail = ?",
                [users[0].userEmail],
                (err, rows, fields) => {
                  if (err) {
                    req.flash("loginMessage", "Token Error: contact Colby");
                    res.redirect("/User/LogIn");
                  } else {
                    // let them reset the password now

                    // debug("user: ", users[0]);
                    res.render("user/forgot-password-reset", {
                      csrfToken: req.csrfToken(),
                      user: users[0]
                      // user: req.session.passport.user,
                      // message: req.flash("errorMessage")
                    });
                  }
                }
              );
            }
          );
        }
      }
    );

    // debug("email of user to reset: ", email);

    // debug("user: ", user);
  }
  function postForgotPasswordReset(req, res) {
    const email = req.body.email;

    const newPassword = req.body.password;
    // debug("user for password update", user);
    getConnection().query(
      "SELECT * FROM users WHERE UserEmail = ?",
      [email],
      function (err, rows) {
        // debug("user: ", rows[0]);
        if (err) {
          req.flash("errorMessage", err);
          res.redirect("back");
        }

        users = rows.map(row => {
          return {
            userId: row.Id,
            userName: row.UserName,
            userEmail: row.UserEmail
          };
        });
        const user = users[0];

        // if the user is found but the password is wrong

        // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        // debug("user about to log in: ", rows[0]);

        var newHashedPassword = {
          password: bcrypt.hashSync(newPassword, 10, null) // use the generateHash function in our user model
        };

        getConnection().query(
          "UPDATE users SET UserPassword = ? WHERE UserEmail = ?",
          [newHashedPassword.password, email],
          function (err, rows) {
            // debug("user: ", rows[0]);
            if (err) {
              debug("error", err);
              req.flash("errorMessage", err);
              res.redirect("back");
            } else {
              // ----------------------email registrant -------------------
              async function email() {
                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let testAccount = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                  host: "smtp.dreamhost.com",
                  port: 465,
                  secure: true, // true for 465, false for other ports
                  auth: {
                    user: process.env.EMAIL_USER, // generated ethereal user
                    pass: process.env.EMAIL_PASSWORD // generated ethereal password
                  }
                });

                // send mail with defined transport object
                let info = await transporter.sendMail({
                  from: '"Colby Holmstead" <dev@colbyholmstead.com>', // sender address
                  to: `${user.UserEmail}`, // list of receivers
                  subject: "Password Has Changed", // Subject line
                  text: `
                    ${user.UserName}, Your password has been changed.\n
                     If you were not the one who changed your password plase contact Colby at dev@colbyholmstead.com \n
                    I will get back to you as soon as possible.
                    `, // plain text body
                  html: `<p> 
    
                    ${user.UserName},</p>
                     <p>Your password has been changed.</p> 
                     <p> If you were not the one who changed your password plase contact Colby at dev@colbyholmstead.com</p>
                    <p> I will get back to you as soon as possible. </p>` // html body
                });
              }

              email().catch(console.error);

              req.flash("loginMessage", "Password Updated");
              res.redirect("/User/Profile");
            }
          }
        );
      }
    );
  }

  return {
    getUser,
    getLogIn,
    getLogout,
    getRegister,
    getProfileEdit,
    getEditPassword,
    postEditPassword,
    getForgotPassword,
    postForgotPassword,
    getForgotPasswordReset,
    postForgotPasswordReset
  };
}
module.exports = userController;
