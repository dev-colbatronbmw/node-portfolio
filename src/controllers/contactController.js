const debug = require("debug")("app:contactController");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const nodemailer = require("nodemailer");
const session = require("express-session");
const pool = mysql.createPool({
  host: "portfolio-db.colbyholmstead.com",
  user: "colbyportfolio",
  password: "xuqdy8-mukdud-Guwroh",
  database: "crhportfolio",
});

function getConnection() {
  return pool;
}

function contactController() {
  debug("contact controller: ", "working");

  function getContact(req, res) {
    debug("Get Contact: ", "Working");
    debug("form page session ID:", req.sessionID);
    // res.send("about test");
    res.render("contact", {});
  }

  function getMyContacts(req, res) {
    // debug("session info:", session);
    debug("json page session ID:", req.sessionID);
    // console.log("fetching product " + req.params.prodId);
    const connection = getConnection();

    const qString = "SELECT * FROM contacts";
    connection.query(qString, (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for products" + err);
        res.sendStatus(500);
        res.end();
        return;
      }
      // console.log("success?");
      // console.log(rows);

      //code modification
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
    console.log("adding");
    // validate info
    // const firstName = req.body.firstName;
    console.log(req.body);
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
              user: "mail@colbyholmstead.com", // generated ethereal user
              pass: "hiqgog-wezhe0-Fefhuw", // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"Colby Holmstead" <dev@colbyholmstead.com>', // sender address
            to: "dev@colbyholmstead.com", // list of receivers
            subject: "Test", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          });

          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);

        res.redirect("/Contact");
      }
    );
  }
  return {
    getContact,
    postContact,
    getMyContacts,
  };
}
module.exports = contactController;
