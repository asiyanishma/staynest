# Nestly — Listings Clone

A frontend clone of a booking/listings marketplace (Airbnb-style UX), built with React, Vite, and Tailwind CSS. Built as a portfolio project to practice component architecture, state management, and responsive UI design.

![Nestly preview](preview.png)

## Features

- Search listings by title or location
- Filter by category (Beachfront, Cabins, Design, City, and more)
- Responsive card grid (1–4 columns depending on screen size)
- Click-through detail modal with tags, host info, and price
- Save/favorite toggle per listing

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

To build for production:

```bash
npm run build
```

## Project Structure

```
src/
  components/
    Navbar.jsx        - top search bar
    FilterChips.jsx    - category filter row
    ListingCard.jsx     - individual listing card
    ListingModal.jsx    - detail view modal
  data/
    listings.js         - mock listing data
  App.jsx               - main app + state
  main.jsx              - React entry point
```

## Notes

Listing data is mocked locally in `src/data/listings.js`. To connect this to a real backend, swap the static import for an API fetch in `App.jsx`.

## License

MIT
