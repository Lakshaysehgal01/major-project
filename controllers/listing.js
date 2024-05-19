const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const accessToken = process.env.MAP_API_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken });

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({})
    res.render("./listing/index.ejs", { allListing })
}
module.exports.renderNewForm = (req, res) => {
    // console.log(req.user)
    res.render("./listing/new.ejs")
}
module.exports.show = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner", "username");
    if (!listing) {
        req.flash("err", "Listing does not exists!!");
        res.redirect("/listing")
    } else {
        res.render("./listing/show.ejs", { listing })
    }
}
module.exports.addingNewListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,filename)
    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;//user id is given to new listing
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry
    let savedListing = await newListing.save();
    req.flash("success", "Added Successfully");
    console.log(savedListing);
    res.redirect("/listing");
}
module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("err", "Listing does not exists!!");
        return res.redirect("/listing")
    } else {
        let originalurl = listing.image.url
        let link = originalurl.replace("/upload", "/upload/c_fill,w_250")
        res.render("./listing/edit.ejs", { listing, link });
    }
}
module.exports.saveListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(`${id}`)
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
    let updatedListing = await Listing.findByIdAndUpdate(`${id}`, req.body.listing, { runValidators: true })
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    req.flash("update", "Updated Successfully")
    res.redirect(`/listing/${id}`)
}
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id)
    // console.log(deleteListing)
    req.flash("delmsg", "Deleted Successfully")
    res.redirect("/listing")
}