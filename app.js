var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const routes = require("./routes/allroutes");
var bodyParser = require("body-parser");
// Requiring in-built https for creating
// https server
const https = require("https");
const fs = require("fs");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/", routes);

var db = require("./db/connection").mysql_pool;
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const options = {
  key: fs.readFileSync("athulyahomecare.org.key"),
  cert: fs.readFileSync("athulyahomecare.org.cert"),
};

const PORT = process.env.PORT || 4040;

// const server = https.createServer(options, app);

// server.listen(PORT, function () {
//   var datetime = new Date();
//   console.log(datetime.toISOString().slice(0, 10));
//   console.log(`Server is running on port ${PORT}.`);
// });

app.listen(PORT, () => {
  var datetime = new Date();
  console.log(datetime.toISOString().slice(0, 10));
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
