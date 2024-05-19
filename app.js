if (process.env.NODE_ENV != "deployment") {
    require('dotenv').config()
}
const express = require("express");
const app = express();
const port = 8080;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const expressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL
const store = MongoStore.create({
    mongoUrl: dbUrl,
    ttl: 15 * 24 * 60 * 60,// = 15 days
    crypto: {
        secret: process.env.SECERT,
    },
    touchAfter: 24 * 60 * 60//24 hours
})
const sessionOption = {
    store: store,
    secret: process.env.SECERT,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

store.on("error", () => {
    console.log("ERROR in mongo session store!!", err)
})
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate)
app.use(methodOverride("_method"))

main()
    .then(() => { console.log("connected to mongoDB") })
    .catch((err) => { console.log(err) });
async function main() {
    await mongoose.connect(dbUrl);
};

//session and connect-flash set up
app.use(session(sessionOption));
app.use(flash());


//passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash messages stored in res.locals
app.use((req, res, next) => {
    res.locals.msg = req.flash("success");
    res.locals.delMsg = req.flash("delmsg");
    res.locals.update = req.flash("update");
    res.locals.err = req.flash("err");
    res.locals.currUser = req.user
    next();
})

app.use("/listing", listingsRouter)//listing routes

app.use("/listing/:id/review", reviewsRouter)//review router

app.use("/", userRouter)//user router

app.use("*", (req, res, next) => {
    throw new expressError(404, "page not found")
})
app.use((err, req, res, next) => {
    let { status = 400, message = "something went wrong" } = err;
    res.status(status).render("./listing/error.ejs", { err })
})

app.listen(port, () => {
    console.log("app is listening on server 8080");
})