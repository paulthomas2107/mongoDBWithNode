const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

// Connect to DB
connectDB();

const app = express();

// Body Parser
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars Helper
const { formatDate, stripTags, truncate } = require("./helpers/hbs");

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: mongoose.connection._connectionString,
      mongoOptions: {},
    }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
