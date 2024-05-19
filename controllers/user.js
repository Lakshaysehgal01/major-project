const User = require("../models/user.js");
module.exports.signup=async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            email: email,
            username: username
        })
        let registerdUser = await User.register(newUser, password);
        console.log(registerdUser);
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Thankyou for being a part of VentureVista family.")
            res.redirect("/listing")
        })
    } catch (e) {
        req.flash("err", e.message);
        res.redirect("/signup")
    }

}

module.exports.getSignupForm=(req, res) => {
    res.render("./user/signup.ejs")
}
module.exports.getLoginForm=(req, res) => {
    res.render("./user/login.ejs");
}
module.exports.login=(req, res) => {
    req.flash("success", "Welcome back to VentureVista");
    if (res.locals.saveUrl) {
        return res.redirect(res.locals.saveUrl);
    }
    return res.redirect("/listing");
}
module.exports.logout=(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Successfully Logged Out!!");
        res.redirect("/listing")
    })
}