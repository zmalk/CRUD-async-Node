require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/crosOptions");
const logEvents = require("./middleware/logEvents");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verfiyJWT = require("./middleware/verfiyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

//connect to mongoDB

connectDB();

//custom middleware logger
app.use(logger);

//cross origin resource sharing

app.use(cors(corsOptions));
//bulid-in middleware logger
// form Data
// content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// for JSON
app.use(express.json());

//middle ware for cookies
app.use(cookieParser());
//serving static files
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/subdir", require("./routes/subdir"));

app.use(verfiyJWT);
app.use("/employees", require("./routes/api/employees"));

//route handlers with next()

app.get(
  /^\/hello(.html)?$/,
  (req, res, next) => {
    console.log("attempted to access hello.html");
    next();
  },
  (req, res) => {
    res.send("hello world mother fucker");
  }
);
//chaning route handelers

const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res, next) => {
  console.log("done");
  // next()
  res.send("finished");
};
app.get(/^\/chain(.html)?$/, [one, two, three]);
//

//we can use app.all() to handle all http methods
app.get(/\/*/, (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
//error handler
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
