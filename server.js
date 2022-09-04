require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.CONNECTIONMONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection in Database: ON");
    app.emit("Ready");
  })
  .catch((e) => console.log("Connection in Database: OFF", e));
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const routes = require("./routes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");
const {
  middlewareGlobal,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middlewares");

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": [
          "'self'",
          "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js",
          "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js",
          "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js",
        ],
      },
    },
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/public", express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "trycacth",
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONMONGODB }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);

app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));

app.set("view engine", "ejs");

app.use(csrf());

//Those are my middlewares.
app.use(middlewareGlobal);

app.use(checkCsrfError);

app.use(csrfMiddleware);

app.use(routes);

app.on("Ready", () => {
  app.listen(3000, () => {
    console.log("Server on access http://localhost:3000");
  });
});
