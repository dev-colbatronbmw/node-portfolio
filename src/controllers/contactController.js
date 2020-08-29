const debug = require("debug")("app:contactController");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const csurf = require("csurf");

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
    // res.send("about test");
    res.render("contact", {});
  }

  function getMyContacts(req, res) {
    console.log("fetching product " + req.params.prodId);
    const connection = getConnection();

    const qString = "SELECT * FROM api";
    connection.query(qString, (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for products" + err);
        res.sendStatus(500);
        res.end();
        return;
      }
      // console.log("success?");
      console.log(rows);

      //code modification
      const products = rows.map((row) => {
        return {
          prodId: row.prodId,
          prodName: row.prodName,
          prodDesc: row.prodDesc,
          prodPrice: row.prodPrice,
          prodRating: row.prodRating,
        };
      });

      res.json(products);
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
        res.redirect("/Contact");
        res.end();
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
