/* jshint esversion: 8 */

const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json()); // Use express.json() for parsing JSON data

const reviews_data = JSON.parse(fs.readFileSync("reviews.json", "utf8"));
const dealerships_data = JSON.parse(
  fs.readFileSync("dealerships.json", "utf8")
);

// Connect to MongoDB
mongoose
  .connect("mongodb://mongo_db:27017/", { dbName: "dealershipsDB" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const Reviews = require("./review");
const Dealerships = require("./dealership");

(async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data.reviews); // Using dot notation
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data.dealerships); // Using dot notation
    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
})();

// Express route to home
app.get("/", (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get("/fetchReviews", async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

// Express route to fetch reviews by a particular dealer
app.get("/fetchReviews/dealer/:id", async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id }); // Using dot notation
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

// Express route to fetch all dealerships
app.get("/fetchDealers", async (req, res) => {
  try {
    const dealerships = await Dealerships.find();
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealerships" });
  }
});

// Express route to fetch Dealers by a particular state
app.get("/fetchDealers/:state", async (req, res) => {
  try {
    const dealerships = await Dealerships.find({ state: req.params.state }); // Using dot notation
    res.json(dealerships);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealerships by state" });
  }
});

// Express route to fetch dealer by a particular id
app.get("/fetchDealer/:id", async (req, res) => {
  try {
    const dealer = await Dealerships.findOne({ id: req.params.id }); // Using dot notation
    if (dealer) {
      res.json(dealer);
    } else {
      res.status(404).json({ error: "Dealer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching dealer by ID" });
  }
});

// Express route to insert review
app.post("/insert_review", async (req, res) => {
  try {
    const data = req.body;
    const documents = await Reviews.find().sort({ id: -1 });
    let new_id = documents[0].id + 1; // Using dot notation

    const review = new Reviews({
      id: new_id,
      name: data.name, // Using dot notation
      dealership: data.dealership, // Using dot notation
      review: data.review, // Using dot notation
      purchase: data.purchase, // Using dot notation
      purchase_date: data.purchase_date, // Using dot notation
      car_make: data.car_make, // Using dot notation
      car_model: data.car_model, // Using dot notation
      car_year: data.car_year, // Using dot notation
    });

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error inserting review" });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
