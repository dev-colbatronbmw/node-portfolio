const debug = require("debug")("app:passportConfig");

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
require("dotenv/config");
const mysql = require("mysql");
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE,
});

function getConnection() {
  return pool;
}

async function initialize(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser(function (Id, done) {
    getConnection().query("SELECT * FROM users WHERE Id = ? ", [Id], function (
      err,
      rows
    ) {
      done(err, rows[0]);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        getConnection().query(
          "SELECT * FROM users WHERE UserEmail = ?",
          [email],
          function (err, rows) {
            if (err) return done(err);
            if (rows.length) {
              return done(
                null,
                false,
                req.flash("signupMessage", "That email is already taken.")
              );
            } else {
              // if there is no user with that username
              // create the user
              var newUserMysql = {
                email: email,
                password: bcrypt.hashSync(password, 10, null), // use the generateHash function in our user model
              };

              var insertQuery =
                "INSERT INTO users ( UserEmail, UserPassword ) values (?,?)";
              getConnection().query(
                insertQuery,
                [newUserMysql.email, newUserMysql.password],
                function (err, rows) {
                  newUserMysql = rows[0];
                  // newUserMysql.id = rows[0].insertId;
                  debug("user about to sign up: ", rows[0]);
                  return done(null, newUserMysql);
                }
              );
            }
          }
        );
      }
    )
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        getConnection().query(
          "SELECT * FROM users WHERE UserEmail = ?",
          [email],
          function (err, rows) {
            // debug("user: ", rows[0]);
            if (err) return done(err);
            if (!rows.length) {
              return done(
                null,
                false,
                req.flash("loginMessage", "No user found.")
              ); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].UserPassword))
              return done(
                null,
                false,
                req.flash("loginMessage", "Oops! Wrong password.")
              ); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            debug("user about to log in: ", rows[0]);

            return done(null, rows[0]);
          }
        );
      }
    )
  );
}
module.exports = initialize;
