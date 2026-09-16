# StayNest 🏡

A full-stack accommodation booking platform inspired by modern vacation-rental applications, built for discovering and booking stays across the UAE.

StayNest allows users to browse accommodations, search and filter listings, authenticate securely, make bookings, and manage their reservations. Hosts can also access a dedicated dashboard to manage their listings.

## 🚀 Live Demo

**Frontend:** https://staynest-iota-eight.vercel.app/
**Backend:** `https://staynest-wrcs.onrender.com`

> The backend may take a few seconds to respond after periods of inactivity because it is hosted on a free-tier service.

---

## ✨ Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* Browse accommodation listings
* Search stays by destination
* Filter listings by category
* View detailed property information
* Book available accommodations
* View personal bookings
* Cancel existing bookings

### 🏠 Host Features

* Dedicated Host Dashboard
* View and manage accommodation listings
* Add accommodation details
* Manage property information and pricing

### 🔎 Search & Discovery

* Destination-based search
* Category filtering
* UAE-focused destinations including:

  * Dubai
  * Abu Dhabi
  * Fujairah
  * Ras Al Khaimah
  * Al Ain
* Categories such as:

  * Beachfront
  * Cabins
  * Design
  * City
  * Countryside
  * Pools
  * Trending

### 🎨 User Interface

* Responsive React interface
* Reusable components
* Modern accommodation-card layout
* Responsive navigation
* Booking and listing modals
* Clean, user-friendly design

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Vite
* Bootstrap / CSS
* React Components
* REST API Integration

### Backend

* Node.js
* Express.js
* RESTful APIs
* JWT Authentication
* Mongoose

### Database

* MongoDB
* MongoDB Atlas

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 🏗️ Project Architecture

```text
StayNest
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar
│   │   │   ├── ListingCard
│   │   │   ├── ListingModal
│   │   │   ├── FilterChips
│   │   │   ├── MyBookings
│   │   │   └── HostDashboard
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔄 Main User Flow

```text
User
 │
 ▼
Browse StayNest
 │
 ├── Search by destination
 │
 ├── Filter by category
 │
 ▼
View Listing
 │
 ▼
Authenticate
 │
 ▼
Create Booking
 │
 ▼
My Bookings
 │
 └── Cancel Booking
```

---

## 🔐 Authentication

StayNest uses **JSON Web Tokens (JWT)** to authenticate users.

Authenticated requests include the JWT in the request headers:

```text
Authorization: Bearer <token>
```

Protected functionality includes booking management and host-related operations.

---

## 🔌 API Overview

The backend exposes RESTful API endpoints for the application's core functionality.

| Method                   | Endpoint                   | Purpose                         |
| ------------------------ | -------------------------- | ------------------------------- |
| GET                      | `/api/listings`            | Retrieve accommodation listings |
| POST                     | `/api/bookings`            | Create a booking                |
| GET                      | `/api/bookings`            | Retrieve user bookings          |
| DELETE                   | `/api/bookings/:bookingId` | Cancel a booking                |
| Authentication endpoints | `/api/...`                 | User authentication             |

> API endpoints may evolve as the project is further developed.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/asiyanishma/staynest.git
cd staynest
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Configure frontend environment variables

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

Replace the URL with your deployed backend URL when using the production environment.

### 4. Start the frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

### 5. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 6. Configure backend environment variables

Create a `.env` file inside the server directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 7. Start the backend

```bash
node server.js
```

The backend will run at:

```text
http://localhost:5000
```

---

## 🌐 Deployment

### Frontend — Vercel

The React frontend can be deployed using Vercel.

Set the production environment variable:

```env
VITE_API_URL=https://staynest-wrcs.onrender.com
```

### Backend — Render

The Express backend is deployed on Render:

```text
https://staynest-wrcs.onrender.com
```

### Database — MongoDB Atlas

StayNest uses MongoDB Atlas for cloud database storage.

---

## 📸 Screenshots

Add screenshots of the application here.

### Home Page

![StayNest Home Page](screenshots/home.png)

### Listing Details

![StayNest Listing](screenshots/listing.png)

### My Bookings

![StayNest Bookings](screenshots/bookings.png)

### Host Dashboard

![StayNest Host Dashboard](screenshots/host-dashboard.png)

> Create a `screenshots` folder in the repository and add your application screenshots before enabling these images.

---

## 📌 Key Learning Outcomes

Through this project, I worked with:

* Building reusable React components
* Managing application state in React
* Connecting a React frontend with an Express backend
* Designing and consuming RESTful APIs
* MongoDB and Mongoose data modeling
* JWT-based authentication
* Protected API routes
* Booking and reservation workflows
* Search and filtering functionality
* Environment variables and API configuration
* Deploying full-stack applications
* Connecting a deployed frontend with a cloud backend

---

## 🔮 Future Improvements

* Real-time booking availability
* Online payment integration
* Image upload and cloud storage
* Advanced date-based availability
* Host listing creation and editing
* Reviews and ratings
* Wishlist functionality
* Improved validation and error handling
* Real-time notifications
* Automated testing

---

## 👩‍💻 Author

**Asiya Nishma**
Full-Stack Web Development

* GitHub: [github.com/asiyanishma](https://github.com/asiyanishma)
* LinkedIn: [linkedin.com/in/asiya-nishma](https://www.linkedin.com/in/asiya-nishma)

---

## 📄 License

This project was created for educational and portfolio purposes.
