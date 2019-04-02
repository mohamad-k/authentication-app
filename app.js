const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const app = express();
const port = process.env.PORT || 3100;
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);
const db = require("./config/keys").mongokey;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("connected to database");
  });
mongoose.Promise = global.Promise;
app.use(ejsLayouts);
app.set("view engine", "ejs");
app.set(express.static(__dirname + "views"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "keyboard",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(port, () => {
  console.log(`app run on ${port}`);
});
