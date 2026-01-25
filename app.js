const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const ejsMate = require("ejs-mate");
const path = require("path");


app.listen(8080, () => {
    console.log("server is working fine");
});

// DATABASE CONNECTION
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
    console.log("database setup complete");
}
main().catch(err => console.log(err));

// APP CONFIG
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));



// HOME
app.get("/", (req, res) => {
    res.send("good connection");
});

// INDEX - ALL LISTINGS
app.get("/listings", async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index", { alllistings });
});

// SEARCH ROUTE — must be ABOVE /listings/:id
app.get("/listings/search", async (req, res) => {
  try {
    const { location } = req.query;

    const alllistings = await Listing.find({
      location: { $regex: location, $options: "i" } // case-insensitive
    });

    // listings already contains _id for each item
    res.render("listings/index", { alllistings });

  } catch (err) {
    console.error(err);
    res.status(500).send("Search failed");
  }
});



// TEST DATA
app.get("/testlistings", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Bungalow",
        description: "Near the Beach",
        image: "",
        price: 12000,
        location: "Indore, MP",
        country: "India",
    });

    await sampleListing.save();
    res.send("successful testing");
});

// NEW LISTING FORM
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

// CREATE LISTING
app.post("/listings", async (req, res) => {
  try {
    let newListing = new Listing({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      location: req.body.location,
      country: req.body.country,
    });

    await newListing.save();
    res.redirect("/listings");
}

 catch (err) {
  res.render("listings/new", { error: "Please fill all fields correctly" });
}

});


// EDIT FORM
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/update", { listing });
});

// UPDATE LISTING
app.post("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect("/listings");
    
}

);



// SHOW SINGLE LISTING
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
});

//DELETE LISTING
app.post("/listings/:id/delete", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

