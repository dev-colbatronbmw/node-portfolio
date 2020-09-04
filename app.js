const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv/config");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");

const mysql = require("mysql");

var db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER_DATA,
  password: process.env.DATABASE_ACCESS,
  database: process.env.DATABASE,
});

// db.connect(function (err) {
//   if (err) {
//     console.error("error connecting: " + err.stack);
//     return;
//   }
//   debug("connected to Database");
// });

// db.end();
const app = express();

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

const port = process.env.PORT || 5000;

const csrfMiddleware = csurf({
  cookie: true,
});

// const IN_PROD = NODE_ENV === "production";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_TUNNLE,
    resave: false,
    saveUninitialized: false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 3),
  })
);
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
const homeRouter = require("./src/routes/homeRoutes")(db);

app.use("/", homeRouter);

app.listen(port, () => {
  debug(`Listening on port ${chalk.blueBright(port)}`);
});
