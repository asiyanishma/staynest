require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/Listing");

const listings = [
  {
    id: 1,
    title: "Sunlit loft in Jumeirah",
    location: "Dubai, UAE",
    category: "City",
    price: 950,
    rating: 4.92,
    nights: 3,
    host: "Layla",
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900",
    tags: ["Wifi", "Pool", "Kitchen"],
  },
  {
    id: 2,
    title: "Cliffside villa with sea view",
    location: "Fujairah, UAE",
    category: "Beachfront",
    price: 2200,
    rating: 4.98,
    nights: 2,
    host: "Omar",
    image:
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=900",
    tags: ["Beachfront", "Private pool"],
  },
  {
    id: 3,
    title: "Minimalist desert cabin",
    location: "Al Ain, UAE",
    category: "Cabins",
    price: 1200,
    rating: 4.85,
    nights: 4,
    host: "Fatima",
    image:
      "https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?auto=compress&cs=tinysrgb&w=900",
    tags: ["Fireplace", "Desert view"],
  },
  {
    id: 4,
    title: "Architect-designed studio",
    location: "Abu Dhabi, UAE",
    category: "Design",
    price: 800,
    rating: 4.9,
    nights: 3,
    host: "Yusuf",
    image:
      "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=900",
    tags: ["Design", "Balcony"],
  },
  {
    id: 5,
    title: "Palm grove farmhouse",
    location: "Ras Al Khaimah, UAE",
    category: "Countryside",
    price: 1100,
    rating: 4.78,
    nights: 5,
    host: "Noora",
    image:
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=900",
    tags: ["Garden", "Farm stay"],
  },
  {
    id: 6,
    title: "Rooftop pool penthouse",
    location: "Dubai Marina, UAE",
    category: "Pools",
    price: 2500,
    rating: 4.99,
    nights: 2,
    host: "Hassan",
    image:
      "https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=900",
    tags: ["Pool", "Skyline view"],
  },
  {
    id: 7,
    title: "Quiet oasis courtyard house",
    location: "Sharjah, UAE",
    category: "Countryside",
    price: 1300,
    rating: 4.7,
    nights: 4,
    host: "Mariam",
    image:
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=900",
    tags: ["Courtyard", "Quiet street"],
  },
  {
    id: 8,
    title: "Modern glass beach house",
    location: "Umm Al Quwain, UAE",
    category: "Beachfront",
    price: 1800,
    rating: 4.88,
    nights: 3,
    host: "Khalid",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    tags: ["Beachfront", "Modern"],
  },
  {
    id: 9,
    title: "Trending downtown flat",
    location: "Dubai, UAE",
    category: "Trending",
    price: 950,
    rating: 4.95,
    nights: 2,
    host: "Sara",
    image:
      "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=900",
    tags: ["Central", "Wifi"],
  },
];

const seedListings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Listing.deleteMany({});

    await Listing.insertMany(listings);

    console.log("9 listings inserted successfully");

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedListings();