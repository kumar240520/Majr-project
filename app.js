// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./Models/listing.js");
// const ejsMate = require("ejs-mate");
// const path = require("path");



// // // Port configuration for Render
// // const PORT = process.env.PORT || 8080;

// // // START SERVER
// // app.listen(PORT, '0.0.0.0', () => {
// //     console.log(`Server running on port ${PORT}`);
// // });

// // ONLY FOR LOCALHOST
// app.listen(8080, () => {
//     console.log("server is working fine");
// });

// // DATABASE CONNECTION
// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
//     console.log("database setup complete");
// }
// main().catch(err => console.log(err));


// // /github deployment server code

// // const dbUrl = process.env.ATLASDB_URL;

// // async function main() {
// //     await mongoose.connect(dbUrl);
// //     console.log("database setup complete");
// // }
// // main().catch(err => console.log(err));


// // APP CONFIG
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));



// // HOME
// app.get("/", (req, res) => {
//     res.send("good connection");
// });

// app.get("/", (req, res) => {
//     res.redirect("/listings");
// });

// // INDEX - ALL LISTINGS
// app.get("/listings", async (req, res) => {
//     const alllistings = await Listing.find({});
//     res.render("listings/index", { alllistings });
// });

// // SEARCH ROUTE — must be ABOVE /listings/:id
// app.get("/listings/search", async (req, res) => {
//   try {
//     const { location } = req.query;

//     const alllistings = await Listing.find({
//       location: { $regex: location, $options: "i" } // case-insensitive
//     });

//     // listings already contains _id for each item
//     res.render("listings/index", { alllistings });

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Search failed");
//   }
// });



// // TEST DATA
// app.get("/testlistings", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Bungalow",
//         description: "Near the Beach",
//         image: "",
//         price: 12000,
//         location: "Indore, MP",
//         country: "India",
//     });

//     await sampleListing.save();
//     res.send("successful testing");
// });

// // NEW LISTING FORM
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new");
// });

// // CREATE LISTING
// app.post("/listings", async (req, res) => {
//   try {
//     let newListing = new Listing({
//       title: req.body.title,
//       description: req.body.description,
//       image: req.body.image,
//       price: req.body.price,
//       location: req.body.location,
//       country: req.body.country,
//     });

//     await newListing.save();
//     res.redirect("/listings");
// }

//  catch (err) {
//   res.render("listings/new", { error: "Please fill all fields correctly" });
// }

// });


// // EDIT FORM
// app.get("/listings/:id/edit", async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/update", { listing });
// });

// // UPDATE LISTING
// app.post("/listings/:id", async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndUpdate(id, req.body);
//     res.redirect("/listings");
    
// }

// );



// // SHOW SINGLE LISTING
// app.get("/listings/:id", async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/show", { listing });
// });

// //DELETE LISTING
// app.post("/listings/:id/delete", async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// });



//******Render hosting code by cluade ai  */

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const ejsMate = require("ejs-mate");
const path = require("path");

// Port configuration for Render (FIXED: Added 0.0.0.0 binding)
const PORT = process.env.PORT || 8080;

// DATABASE CONNECTION (FIXED: Removed hardcoded credentials)
const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
    console.error("❌ ERROR: ATLASDB_URL environment variable is not set!");
    console.error("Please set it in your Render dashboard.");
    process.exit(1);
}

async function main() {
    await mongoose.connect(dbUrl);
    console.log("✅ Database connection successful");
}

main().catch(err => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
});

// APP CONFIG
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ROUTES

// HOME - Redirect to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// INDEX - ALL LISTINGS
app.get("/listings", async (req, res) => {
    try {
        const alllistings = await Listing.find({});
        res.render("listings/index", { alllistings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading listings");
    }
});

// SEARCH ROUTE — must be ABOVE /listings/:id
app.get("/listings/search", async (req, res) => {
    try {
        const { location } = req.query;

        const alllistings = await Listing.find({
            location: { $regex: location, $options: "i" } // case-insensitive
        });

        res.render("listings/index", { alllistings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Search failed");
    }
});

// TEST DATA
app.get("/testlistings", async (req, res) => {
    try {
        let sampleListing = new Listing({
            title: "My New Bungalow",
            description: "Near the Beach",
            image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
            price: 12000,
            location: "Indore, MP",
            country: "India",
        });

        await sampleListing.save();
        res.send("✅ Successful testing - Sample listing created");
    } catch (err) {
        console.error(err);
        res.status(500).send("Test failed");
    }
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
    } catch (err) {
        console.error(err);
        res.render("listings/new", { error: "Please fill all fields correctly" });
    }
});

// EDIT FORM
app.get("/listings/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        
        res.render("listings/update", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading edit form");
    }
});

// UPDATE LISTING
app.post("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body);
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating listing");
    }
});

// SHOW SINGLE LISTING
app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        
        res.render("listings/show", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading listing");
    }
});

// DELETE LISTING
app.post("/listings/:id/delete", async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting listing");
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// START SERVER (FIXED: Added 0.0.0.0 binding for Render)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});