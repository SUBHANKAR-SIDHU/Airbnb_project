const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/paradise";

main()
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("hii im root");
});

//index routes
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  }),
);

//new routes
app.get("/listing/new", async (req, res) => {
  res.render("listing/new.ejs");
});

// show routes
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
  }),
);

//create routes
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.Listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

//edit routes
app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  }),
);

//update routes
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    res.redirect("/listings");
  }),
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletelisiting = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);
app.use("/listings/:id", (err, req, res, next) => {
  console.log("middlework");
  res.send("page not found");
});
app.use((error, req, res, next) => {
  res.send("something want to wrong");
});

app.listen(8080, () => {
  console.log("http://localhost:8080");
});
