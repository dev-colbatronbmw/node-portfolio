const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
// const sql = require("mssql");
const bodyParser = require("body-parser");
const csurf = require("csurf");
// const session = require("express-session");
const cookieParser = require("cookie-parser");

// const sql = require("mssql");

const app = express();
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

const port = process.env.PORT || 5000;
// const TWO_HOURS = 1000 * 60 * 10;
// const {
// SESS_LIFETIME = TWO_HOURS,
// NODE_ENV = "development",
// SESS_SECRET = "ssh!thisis'atest!",
// SESS_NAME = "sid",
// } = process.env;
//
// sql.connect(config).catch((err) => debug(err));
const csrfMiddleware = csurf({
  cookie: true,
});

// const IN_PROD = NODE_ENV === "production";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfMiddleware);

// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: "ssh!thisis'atest!",
//     cookie: {
//       maxAge: TWO_HOURS,
//       sameSite: true,
//       secure: false,
//     },
//   })
// );
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "css")));
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

const aboutRouter = require("./src/routes/aboutRoutes")();

app.use("/About", aboutRouter);

const contactRouter = require("./src/routes/contactRoutes")();

app.use("/Contact", contactRouter);
const homeRouter = require("./src/routes/homeRoutes")();

app.use("/", homeRouter);

app.listen(port, () => {
  debug(`Listening on port ${chalk.blueBright(port)}`);
});
