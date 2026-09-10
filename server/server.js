const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const authRoutes = require("./auth");
const bookingRoutes = require("./bookings");
const hostRoutes = require("./host");
const Listing = require("./models/Listing");

const app = express();

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// API ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/host", hostRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("StayNest backend is running!");
});

// ===============================
// GET ALL LISTINGS
// ===============================

app.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ id: 1 });

    res.json(listings);
  } catch (error) {
    console.error("Fetch listings error:", error);

    res.status(500).json({
      message: "Failed to fetch listings",
    });
  }
});

// ===============================
// START SERVER
// ===============================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `StayNest server running on http://localhost:${PORT}`
  );
});