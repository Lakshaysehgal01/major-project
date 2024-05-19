const mongoose=require("mongoose")
const Listing=require("../models/listing.js")
let sampleListings=require("./data.js");

main()
.then(console.log("succesfully connected to mongo"))
.catch((err)=>{console.log(err)})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
async function addData(){
    await Listing.deleteMany({})
    sampleListings=sampleListings.map((obj)=>({...obj,owner:'6627ebca56f6f6b6ef14aacb'}))
    await Listing.insertMany(sampleListings)
    console.log("data was saved")
}
addData()

// console.log(sampleListings)