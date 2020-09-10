const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const passport = require("passport");

require("dotenv/config");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");

const app = express();

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

const port = process.env.PORT || 5000;

const csrfMiddleware = csurf({
  cookie: true,
});

// const IN_PROD = NODE_ENV === "production";

const initializePassport = require("./passport-config");
initializePassport(
  passport
  // (email) =>
  //   getConnection().query(
  //     "SELECT * FROM users WHERE UserEmail = ? ",
  //     [email],
  //     function (err, rows) {
  //       done(null, rows[0]);
  //     }
  //   ),
  // (id) =>
  //   getConnection().query("SELECT * FROM users WHERE Id = ? ", [id], function (
  //     err,
  //     rows
  //   ) {
  //     done(err, rows[0]);
  //   })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(csrfMiddleware);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "css")));
app.use(express.static(path.join(__dirname, "public", "js")));
app.use(
  "/css",
  express.static(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "css")
  )
);

app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js")),
  express.static(path.join(__dirname, "/node_modules/jquery/dist")),
  express.static(path.join(__dirname, "/node_modules/popper.js/dist"))
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: process.env.SECRET_TUNNLE,
    resave: true,
    saveUninitialized: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 3),
  })
);

const userRouter = require("./src/routes/userRoutes")();

app.use("/User", userRouter);

const otherRouter = require("./src/routes/otherRoutes")();

app.use("/Other", otherRouter);
const expRouter = require("./src/routes/expRoutes")();

app.use("/Exp", expRouter);

const nodeRouter = require("./src/routes/nodeRoutes")();

app.use("/Node", nodeRouter);
const aboutRouter = require("./src/routes/aboutRoutes")();

app.use("/About", aboutRouter);

const contactRouter = require("./src/routes/contactRoutes")();

app.use("/Contact", contactRouter);
const homeRouter = require("./src/routes/homeRoutes")();

app.use("/", homeRouter);

app.listen(port, () => {
  debug(`Listening on port ${chalk.blueBright(port)}`);
});
