const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const { isOwner, isLoggedin, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudinarConfig.js");
const upload = multer({ storage })


router.route("/")
    .get(wrapAsync(listingController.index))//index route
    .post(isLoggedin, upload.single('listing[image]'), validateListing, wrapAsync(listingController.addingNewListing))//create route

//new route
router.get("/new", isLoggedin, listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.show))//show route 
    .patch(isLoggedin, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.saveListing))//patch route
//edit route
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.edit))
//delete route
router.delete("/:id/delete", isLoggedin, isOwner, wrapAsync(listingController.destroyListing))
module.exports = router