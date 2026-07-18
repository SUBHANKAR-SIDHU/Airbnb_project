const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const MONGO_URL = 'mongodb://127.0.0.1:27017/paradise'

main().then(()=>{
    console.log("Connection successful");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req, res)=>{
    res.send("hii im root");
});

//index routes
app.get("/listings",async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing})
});


//new routes
app.get("/listing/new",async(req,res)=>{
    res.render("listing/new.ejs");
});

// show routes
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
});

//create routes
app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.Listing); 
    await newListing.save();
    res.redirect("/listings");
});

//edit routes
app.get("/listing/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{listing})
});

//update routes
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect("/listings")
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const deletelisiting = await Listing.findByIdAndDelete(id);
    console.log(deletelisiting);
    res.redirect("/listings");
})


app.listen(8080,()=>{
    console.log("http://localhost:8080");
});