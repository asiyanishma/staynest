const express = require("express");
const jwt = require("jsonwebtoken");
const Listing = require("./models/Listing");
const User = require("./models/User");

const router = express.Router();

// ===============================
// AUTHENTICATE USER
// ===============================

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Login required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ===============================
// CREATE HOST LISTING
// ===============================

router.post("/listings", authenticateUser, async (req, res) => {
  try {
    const {
      title,
      location,
      category,
      price,
      image,
      tags,
    } = req.body;

    if (
      !title ||
      !location ||
      !category ||
      !price ||
      !image
    ) {
      return res.status(400).json({
        message:
          "Title, location, category, price and image are required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const lastListing = await Listing.findOne().sort({
      id: -1,
    });

    const newId = lastListing
      ? lastListing.id + 1
      : 1;

    const listing = await Listing.create({
      id: newId,
      hostId: user._id,
      title,
      location,
      category,
      price: Number(price),
      rating: 5,
      nights: 1,
      host: user.name,
      image,
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);

    res.status(500).json({
      message: "Failed to create listing",
    });
  }
});

// ===============================
// GET MY LISTINGS
// ===============================

router.get("/listings", authenticateUser, async (req, res) => {
  try {
    const listings = await Listing.find({
      hostId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(listings);
  } catch (error) {
    console.error("Fetch host listings error:", error);

    res.status(500).json({
      message: "Failed to fetch host listings",
    });
  }
});

// ===============================
// EXPORT ROUTER
// ===============================

module.exports = router;