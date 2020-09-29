const debug = require("debug")("app:contactController");
require("dotenv/config");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
("use strict");
const nodemailer = require("nodemailer");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE
});

function getConnection() {
  return pool;
}

function contactController() {
  debug("contact controller: ", "working");

  function getContact(req, res) {
    const Page = "Contact";

    debug("Get Contact: ", "Working");

    if (typeof req.session.passport !== "undefined") {
      res.render("contact", {
        user: req.session.passport.user,
        csrfToken: req.csrfToken()
      });
    } else {
      res.render("contact", {
        csrfToken: req.csrfToken()
      });
    }
  }

  function postContact(req, res) {
    const FirstName = req.body.firstName;
    const LastName = req.body.lastName;
    const Company = req.body.company;
    const Zip = req.body.zip;
    const Phone = req.body.phone;
    const Email = req.body.email;
    const TypeOfContact = req.body.TypeOfContact;
    const Comments = req.body.comment;
    const Contacted = 0;
    var didContact = "";
    if (Contacted === 0) {
      didContact = "Not Contacted";
    } else {
      didContact = "Contacted";
    }
    const qString =
      "INSERT INTO contacts (FirstName, LastName, Company, Zip, Phone, Email, TypeOfContact, Comments, Contacted) Values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    getConnection().query(
      qString,
      [
        FirstName,
        LastName,
        Company,
        Zip,
        Phone,
        Email,
        TypeOfContact,
        Comments,
        Contacted
      ],
      (err, results, fields) => {
        if (err) {
          console.log("failed to add contact" + err);
          res.sendStatus(500);
          return;
        }

        //----------------email me when signed up --------------------
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          let testAccount = await nodemailer.createTestAccount();

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
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
            to: "dev@colbyholmstead.com", // list of receivers
            subject: "New Registrant", // Subject line
            text: `
              First Name: ${FirstName}\n
              Last Name: ${LastName}\n
             Company: ${Company}\n
              Zip: ${Zip}\n
              Phone: ${Phone}\n
              Email: ${Email}\n
              How To Contact: ${TypeOfContact}\n
              Comments: ${Comments}\n
              ${didContact}
            `, // plain text body
            html: `<p>  Name: ${FirstName}
            ${LastName}<br/>
            Company: ${Company}<br/>
            Zip: ${Zip}<br/>
            Phone: ${Phone}<br/>
            Email: ${Email}<br/>
            How To Contact: ${TypeOfContact}<br/>
            Comments: ${Comments}<br/>
            ${didContact}
            </p>` // html body
          });
        }

        main().catch(console.error);

        //------------------------end email me ----------------
        // ----------------------email registrant -------------------
        async function secondary() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          let testAccount = await nodemailer.createTestAccount();

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
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
            to: `${Email}`, // list of receivers
            subject: "Thank You", // Subject line
            text: `
       ${FirstName} ${LastName}\n
   
       Thank you for your interest! \n
      I will get back to you as soon as possible.
    `, // plain text body
            html: `<p> 
            
            ${FirstName} ${LastName}<br/>
   
            Thank you for your interest! <br/>
           I will get back to you as soon as possible.</p>` // html body
          });
        }

        secondary().catch(console.error);

        res.redirect("/Contact");
      }
    );
  }

  return {
    getContact,
    postContact
    // getMyContacts,
  };
}
module.exports = contactController;
