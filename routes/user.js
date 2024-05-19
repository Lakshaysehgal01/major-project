const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
router.route("/signup")
    .get(userController.getSignupForm)
    .post(wrapAsync(userController.signup));
router.route("/login")
    .get(userController.getLoginForm)
    .post(saveUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }), userController.login);
router.get("/logout", userController.logout)
module.exports = router;