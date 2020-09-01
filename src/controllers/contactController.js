const debug = require("debug")("app:contactController");
require("dotenv/config");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const csurf = require("csurf");
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
  const Page = "Contact";

  function getContact(req, res) {
    debug("Get Contact: ", "Working");
    res.render("contact", {
      Page: "Contact",
      csrfToken: req.csrfToken(),
      variable: req.session.variable,
    });
  }

  function getMyContacts(req, res) {
    const connection = getConnection();

    const qString = "SELECT * FROM contacts";
    connection.query(qString, (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for products" + err);
        res.sendStatus(500);
        res.end();
        return;
      }
      const contacts = rows.map((row) => {
        return {
          FirstName: row.FirstName,
          lastName: row.LastName,
          Email: row.Email,
          Company: row.Company,
          Zip: row.Zip,
          Comments: row.Comments,
          Phone: row.Phone,
          TypeOfContact: row.TypeOfContact,
          Contacted: row.Contacted,
        };
      });

      res.json(contacts);
    });
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
          console.log("failed to insert product" + err);
          res.sendStatus(500);
          return;
        }

        debug("Form: ", "Sent");

        res.redirect("/Contact");
      }
    );
  }
  function getFeedback(req, res) {
    if (req.session.variable === "hide") {
      req.session.variable = "show";
    } else {
      req.session.variable = "hide";
    }
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
    getMyContacts,
    getFeedback,
    postFeedback,
  };
}
module.exports = contactController;
