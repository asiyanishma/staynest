const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listingId: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    nights: {
      type: Number,
      required: true,
    },

    checkIn: {
      type: String,
    },

    checkOut: {
      type: String,
    },

    guests: {
      type: Number,
    },

    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
    strict: false,
    collection: "bookings",
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;