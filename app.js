require('dotenv').config();
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    methodOverride = require("method-override");

// review routes
var commentRoutes = require("./routes/comments"),
    reviewRoutes = require("./routes/reviews"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// requring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log('error', err.message);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.get("/", function (req, res) {
    res.render("landing");
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(process.env.PORT, process.env.IP);

app.listen(3000, () => {
    console.log("Server Listening");
});