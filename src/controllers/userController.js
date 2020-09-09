const debug = require("debug")("app:userController");
require("dotenv/config");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
("use strict");
const passport = require("passport");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE,
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
    const Page = "User";
    res.cookie("Page", Page);
    debug("Get user: ", "Working");
    res.render("user/profile", {
      Page: "User",
      csrfToken: req.csrfToken(),
      variable: req.session.variable,
    });
  }
  function getLogIn(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    const Page = "User";
    res.cookie("Page", Page);
    debug("Get user: ", "Working");
    res.render("user/login", {
      Page: "User/LogIn",
      csrfToken: req.csrfToken(),
      variable: req.session.variable,
      message: req.flash("loginMessage"),
    });
  }
  function postLogIn(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    const Page = "User";
    res.cookie("Page", Page);
    debug("Get user: ", "Working");
    res.render("user/profile", {
      Page: "User",
      csrfToken: req.csrfToken(),
      variable: req.session.variable,
    });
  }
  function getRegister(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    const Page = "User";
    res.cookie("Page", Page);
    debug("Get user: ", "Working");
    res.render("user/register", {
      Page: "User/Register",
      csrfToken: req.csrfToken(),
      variable: req.session.variable,
      message: req.flash("signupMessage"),
    });
  }
  function postRegister(req, res) {
    debug("Post Register: ", "Working");
    passport.authenticate("local-signup", {
      successRedirect: "/User", // redirect to the secure profile section
      failureRedirect: "/User/Register", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    });
  }

  //     res.header(
  //       "Cache-Control",
  //       "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  //     );
  //     findContact();
  //     async function main(contactId) {
  //       try {
  //         const hashedPassword = await bcrypt.hash(req.body.password, 10);
  //         const { name } = req.body;
  //         const { email } = req.body;
  //         const password = hashedPassword;
  //         contactId = contactId;
  //         // do the user storage
  //         debug("user name: ", name);
  //         debug("user email: ", email);
  //         debug("user password: ", hashedPassword);

  //         //check for duplicate here

  //         try {
  //           const queryString =
  //             "INSERT INTO users (UserName, UserEmail, UserPassword, ContactId) VALUES (?, ?, ?, ?)";
  //           getConnection().query(
  //             queryString,
  //             [name, email, password, contactId],
  //             (err, results, fields) => {
  //               if (err) {
  //                 console.log("failed to insert registrant " + err);
  //                 debug("find error: ", err);
  //                 res.redirect("/User/Register");
  //               }

  //               const Page = "User";
  //               res.cookie("Page", Page);
  //               debug("Get user: ", "Working");
  //               res.render("user/profile", {
  //                 Page: "Profile",
  //                 csrfToken: req.csrfToken(),
  //                 variable: req.session.variable,
  //               });
  //             }
  //           );
  //         } catch (err) {
  //           debug("find error: ", err);
  //           res.redirect("/User/Register");
  //         }
  //       } catch (err) {
  //         debug("find error: ", err);
  //         res.redirect("/User/Register");
  //       }
  //     }

  //     async function findContact() {
  //       try {
  //         const qString = "Select * FROM contacts WHERE Email = ?";
  //         getConnection().query(
  //           qString,
  //           [req.body.email],
  //           (err, rows, fields) => {
  //             if (err) {
  //               console.log("Failed to query for products" + err);
  //               res.sendStatus(500);
  //               res.end();
  //               return;
  //             }

  //             const contact = rows.map((row) => {
  //               return {
  //                 id: row.Id,
  //                 firstName: row.FirstName,
  //                 lastName: row.LastName,
  //                 email: row.Email,
  //                 company: row.Company,
  //                 zip: row.Zip,
  //                 phone: row.Phone,
  //               };
  //             });

  //             if (!contact) {
  //               debug("Contact: ", contact[0]);
  //               //code modification
  //               main(contact[0].id);
  //             } else {
  //               debug("Contact id: ", 0);
  //               main(0);
  //             }
  //           }
  //         );
  //       } catch (err) {
  //         res.redirect("/User/Register");
  //         debug("find error: ", err);
  //       }
  //     }
  //   }
  //-----------start feedback---------
  //-----------start feedback log in---------
  function getFeedbackShowLogIn(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.session.variable = "show";
    res.redirect("/User/LogIn");
  }

  function getFeedbackLogIn(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.session.variable = "hide";
    res.redirect("/User/LogIn");
  }

  function postFeedbackLogIn(req, res) {
    // make insert query
    const email = req.body.email;
    const page = "user/login";
    const feedback = req.body.comment;
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

        async function main() {
          let testAccount = await nodemailer.createTestAccount();
          let transporter = nodemailer.createTransport({
            host: "smtp.dreamhost.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
          let info = await transporter.sendMail({
            from: '"Colby Holmstead" <dev@colbyholmstead.com>', // sender address
            to: "dev@colbyholmstead.com", // list of receivers
            subject: "New FeedBack", // Subject line
            text: `
              Email: ${email}\n
             Feedback: ${feedback}\n
             Page Sent from: ${page}\n
              Is the feedback good?: ${good}\n
              Completed: ${complete}\n
           
            `, // plain text body
            html: `<p>   
             Email: &nbsp ${email}<br/>
            Feedback: &nbsp  ${feedback}<br/>
            Page Sent from: &nbsp  ${page}<br/>
             Is the feedback good?: &nbsp  ${good}<br/>
             Completed: &nbsp  ${complete}<br/>
            </p>`, // html body
          });
        }

        main().catch(console.error);
        async function secondary() {
          let testAccount = await nodemailer.createTestAccount();
          let transporter = nodemailer.createTransport({
            host: "smtp.dreamhost.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
          let info = await transporter.sendMail({
            from: '"Colby Holmstead" <dev@colbyholmstead.com>', // sender address
            to: `${email}`, // list of receivers
            subject: "Feedback to Colby Holmstead", // Subject line
            text: `
            So you want me to look at:  \n 
           ${feedback} \n
           I can fix that no Problem. (Probably)\n \n
            I will let you know when I do. 
            `, // plain text body
            html: `<p>   
            So you want me to look at:<br/> ${feedback}<br/> <br/>  I can fix that no Problem. (Probably)<br/><br/>
            I will let you know when I do. 
            </p>`, // html body
          });
        }

        secondary().catch(console.error);

        req.session.variable = "hide";
        res.render("user/login", {
          Page: "User/LogIn",
          csrfToken: req.csrfToken(),
          variable: req.session.variable,
        });
      }
    );
  }

  return {
    getUser,
    getLogIn,
    postLogIn,
    getRegister,
    postRegister,
  };
}
module.exports = userController;
