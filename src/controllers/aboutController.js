const debug = require("debug")("app:aboutController");
const session = require("express-session");
require("dotenv/config");
const mysql = require("mysql");
("use strict");
const nodemailer = require("nodemailer");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE,
});

function getConnection() {
  return pool;
}

function aboutController() {
  debug("about controller: ", "working");

  function getAbout(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    debug("Get About: ", "Working");
    res.render("about", {
      csrfToken: req.csrfToken(),
      Page: "About",
      variable: req.session.variable,
    });
  }
  function getFeedbackShow(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.session.variable = "show";
    res.redirect("/About");
  }

  function getFeedback(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.session.variable = "hide";

    res.redirect("/About");
  }

  function postFeedback(req, res) {
    // make insert query
    const email = req.body.email;
    const feedback = req.body.comment;
    const page = "About";
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
        res.redirect("/About");
      }
    );
  }

  return {
    getAbout,
    getFeedback,
    getFeedbackShow,
    postFeedback,
  };
}
module.exports = aboutController;
