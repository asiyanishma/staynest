const express = require("express");
const jwt = require("jsonwebtoken");
const Booking = require("./models/Booking");

const router = express.Router();

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Login required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// CREATE BOOKING
router.post("/", authenticateUser, async (req, res) => {
  try {
    const {
      listingId,
      title,
      location,
      image,
      price,
      nights,
      checkIn,
      checkOut,
      guests,
      total,
    } = req.body;

    // Check for overlapping booking
    const existingBooking = await Booking.findOne({
      listingId,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This property is already booked for those dates.",
      });
    }

    const booking = new Booking({
      userId: req.user.userId,
      listingId,
      title,
      location,
      image,
      price,
      nights,
      checkIn,
      checkOut,
      guests,
      total,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);

    res.status(500).json({
      message: "Failed to create booking",
    });
  }
});

// GET CURRENT USER'S BOOKINGS
router.get("/", authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
});

// DELETE CURRENT USER'S BOOKING
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
});

module.exports = router;