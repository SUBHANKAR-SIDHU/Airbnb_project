const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/black-and-blue-laptop-computer-bGWVhFY1gH0",
        set: (v)=> v === "" ? "https://unsplash.com/photos/black-and-blue-laptop-computer-bGWVhFY1gH0" : v,
    },
    price: Number,
    location : String ,
    country : String
});

const Listing = mongoose.model("Listing",listingschema);

module.exports = Listing ; 

