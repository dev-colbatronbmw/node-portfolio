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
  database: process.env.DATABASE,
});

function getConnection() {
  return pool;
}

function contactController() {
  debug("contact controller: ", "working");

  function getContact(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    const Page = "Contact";
    res.cookie("Page", Page);
    debug("Get Contact: ", "Working");
    res.render("contact", {
      Page: "Contact",
      csrfToken: req.csrfToken(),
      variable: req.session.variable,
    });
  }

  // function getMyContacts(req, res) {
  //   const connection = getConnection();

  //   const qString = "SELECT * FROM contacts";
  //   connection.query(qString, (err, rows, fields) => {
  //     if (err) {
  //       console.log("Failed to query for products" + err);
  //       res.sendStatus(500);
  //       res.end();
  //       return;
  //     }
  //     const contacts = rows.map((row) => {
  //       return {
  //         FirstName: row.FirstName,
  //         lastName: row.LastName,
  //         Email: row.Email,
  //         Company: row.Company,
  //         Zip: row.Zip,
  //         Comments: row.Comments,
  //         Phone: row.Phone,
  //         TypeOfContact: row.TypeOfContact,
  //         Contacted: row.Contacted,
  //       };
  //     });

  //     res.json(contacts);
  //   });
  // }

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
        Contacted,
      ],
      (err, results, fields) => {
        if (err) {
          console.log("failed to add contact" + err);
          res.sendStatus(500);
          return;
        }

        ("use strict");
        const nodemailer = require("nodemailer");
        //----------------email me when signed up --------------------
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
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
              pass: process.env.EMAIL_PASSWORD, // generated ethereal password
            },
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
            </p>`, // html body
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
            host: "smtp.dreamhost.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL_USER, // generated ethereal user
              pass: process.env.EMAIL_PASSWORD, // generated ethereal password
            },
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
           I will get back to you as soon as possible.</p>`, // html body
          });
        }

        secondary().catch(console.error);

        res.redirect("/Contact");
      }
    );
  }
  function getFeedbackShow(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.session.variable = "show";
    res.redirect("/Contact");
  }

  function getFeedback(req, res) {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    req.session.variable = "hide";
    res.redirect("/Contact");
  }

  function postFeedback(req, res) {
    // make insert query
    const email = req.body.email;
    const page = "Contact";
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
        res.render("contact", {
          Page: "Contact",
          csrfToken: req.csrfToken(),
          variable: req.session.variable,
        });
      }
    );
  }
  return {
    getContact,
    postContact,
    // getMyContacts,
    getFeedback,
    getFeedbackShow,
    postFeedback,
  };
}
module.exports = contactController;
