import { useEffect, useMemo, useState } from 'react'
import { Search, MapPin, Sparkles } from 'lucide-react'

import Navbar from './components/Navbar.jsx'
import MyBookings from './components/MyBookings.jsx'
import HostDashboard from './components/HostDashboard.jsx'
import FilterChips from './components/FilterChips.jsx'
import ListingCard from './components/ListingCard.jsx'
import ListingModal from './components/ListingModal.jsx'
import { categories } from './data/listings.js'

export default function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const [selected, setSelected] = useState(null)

  const [showBookings, setShowBookings] = useState(false)
  const [showHostDashboard, setShowHostDashboard] = useState(false)

  const [listings, setListings] = useState([])
  const [bookings, setBookings] = useState([])

  // ===============================
  // LOAD LISTINGS FROM MONGODB
  // ===============================

  useEffect(() => {
    const loadListings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listings`
        )

        const data = await response.json()

        if (response.ok) {
          setListings(data)
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error(
          'Error fetching listings:',
          error
        )
      }
    }

    loadListings()
  }, [])

  // ===============================
  // LOAD USER BOOKINGS
  // ===============================

  const loadBookings = async () => {
    const token = localStorage.getItem(
      'staynestToken'
    )

    if (!token) {
      setBookings([])
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data.message)
        return
      }

      setBookings(data)
    } catch (error) {
      console.error(
        'Error loading bookings:',
        error
      )
    }
  }

  // Load bookings when app starts
  useEffect(() => {
    loadBookings()
  }, [])

  // ===============================
  // FILTER LISTINGS
  // ===============================

  const filtered = useMemo(() => {
    return listings.filter((listing) => {
      const matchesCategory =
        activeCategory === 'All' ||
        listing.category === activeCategory

      const search = query
        .toLowerCase()
        .trim()

      const matchesQuery =
        search === '' ||
        listing.title
          .toLowerCase()
          .includes(search) ||
        listing.location
          .toLowerCase()
          .includes(search) ||
        listing.category
          .toLowerCase()
          .includes(search)

      return (
        matchesCategory &&
        matchesQuery
      )
    })
  }, [
    listings,
    query,
    activeCategory,
  ])

  // ===============================
  // OPEN MY BOOKINGS
  // ===============================

  const openBookings = async () => {
    await loadBookings()

    setShowHostDashboard(false)
    setShowBookings(true)

    setTimeout(() => {
      document
        .getElementById('my-bookings')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
    }, 100)
  }

  // ===============================
  // CLOSE MY BOOKINGS
  // ===============================

  const closeBookings = () => {
    setShowBookings(false)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // ===============================
  // CANCEL BOOKING
  // ===============================

  const handleCancelBooking = async (
    bookingId
  ) => {
    const token = localStorage.getItem(
      'staynestToken'
    )

    if (!token) {
      alert(
        'Please login to manage your bookings.'
      )
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message ||
            'Failed to cancel booking'
        )
        return
      }

      await loadBookings()

      alert(
        'Booking cancelled successfully.'
      )
    } catch (error) {
      console.error(
        'Cancel booking error:',
        error
      )

      alert(
        'Cannot connect to StayNest server.'
      )
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}

      <Navbar
        query={query}
        onQueryChange={setQuery}
        onBecomeHost={() => {
          setShowBookings(false)
          setShowHostDashboard(true)

          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }}
      />

      {/* ================= HOST DASHBOARD ================= */}

      {showHostDashboard && (
        <HostDashboard
          onClose={() => {
            setShowHostDashboard(false)
          }}
        />
      )}

      {/* ================= MY BOOKINGS BUTTON ================= */}

      {!showHostDashboard && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-end border-b border-slate-100">

          <button
            onClick={openBookings}
            className="text-sm font-semibold text-pine hover:underline"
          >
            My Bookings

            {bookings.length > 0 && (
              <span className="ml-2 bg-pine text-white rounded-full px-2 py-0.5 text-xs">
                {bookings.length}
              </span>
            )}
          </button>

        </div>
      )}

      {/* ================= HERO ================= */}

      {!showHostDashboard && (
        <>
          <section className="relative overflow-hidden bg-pine">

            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              <div className="py-16 sm:py-20 lg:py-24">

                <div className="max-w-3xl">

                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white rounded-full px-4 py-2 mb-6 backdrop-blur-sm">

                    <Sparkles size={15} />

                    <span className="text-sm font-medium">
                      Discover stays across the UAE
                    </span>

                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">

                    Find a place
                    <br />

                    <span className="text-ivory">
                      that feels like home.
                    </span>

                  </h1>

                  <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
                    Discover beautiful homes, peaceful retreats and unique stays
                    across the UAE — made for weekends away and unforgettable
                    moments.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">

                    <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-xl">

                      <MapPin
                        size={20}
                        className="text-pine shrink-0"
                      />

                      <div className="flex-1">

                        <p className="text-xs font-semibold text-slate-800">
                          Where do you want to go?
                        </p>

                        <input
                          value={query}
                          onChange={(e) =>
                            setQuery(
                              e.target.value
                            )
                          }
                          placeholder="Dubai, Abu Dhabi, Fujairah..."
                          className="w-full mt-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                        />

                      </div>

                    </div>

                    <button
                      onClick={() => {
                        document
                          .getElementById('stays')
                          ?.scrollIntoView({
                            behavior: 'smooth',
                          })
                      }}
                      className="flex items-center justify-center gap-2 bg-white text-pine font-semibold px-7 py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform"
                    >

                      <Search size={18} />

                      Explore stays

                    </button>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ================= CATEGORIES ================= */}

          <FilterChips
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />

          {/* ================= LISTINGS ================= */}

          <main
            id="stays"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
          >

            <div className="flex items-end justify-between mb-6">

              <div>

                <p className="text-sm font-medium text-pine mb-1">
                  Explore our collection
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Popular stays
                </h2>

              </div>

              <p className="hidden sm:block text-sm text-slate-500">
                {filtered.length} stays
              </p>

            </div>

            {filtered.length === 0 ? (

              <p className="text-pine/60 text-sm py-16 text-center">
                No stays match your search. Try a different destination.
              </p>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">

                {filtered.map((listing) => (

                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onOpen={setSelected}
                  />

                ))}

              </div>

            )}

          </main>

          {/* ================= WHY STAYNEST ================= */}

          <section className="border-t border-slate-100 bg-slate-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

              <div className="max-w-2xl mb-10">

                <p className="text-sm font-semibold text-pine mb-2">
                  Why StayNest?
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  Stay somewhere you’ll love.
                </h2>

                <p className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed">
                  From peaceful retreats to stylish city stays, we make it easy
                  to discover places that feel just right.
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">

                  <div className="w-12 h-12 rounded-2xl bg-pine/10 flex items-center justify-center text-2xl">
                    🏡
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    Handpicked stays
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Discover beautiful homes and unique spaces selected for
                    memorable stays across the UAE.
                  </p>

                </div>

                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">

                  <div className="w-12 h-12 rounded-2xl bg-clay/10 flex items-center justify-center text-2xl">
                    ✨
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    Simple & seamless
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Search, explore and choose your perfect stay with a simple
                    experience designed around you.
                  </p>

                </div>

                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">

                  <div className="w-12 h-12 rounded-2xl bg-sand flex items-center justify-center text-2xl">
                    ❤️
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    Made for memorable moments
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Whether it’s a weekend escape or a longer getaway, find a
                    place that feels like home.
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* ================= UAE DESTINATIONS ================= */}

          <section className="bg-white">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

              <div className="mb-8">

                <p className="text-sm font-semibold text-pine mb-2">
                  Explore the UAE
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  Popular destinations
                </h2>

                <p className="mt-3 text-base text-slate-500">
                  Find your next escape, from vibrant cities to peaceful retreats.
                </p>

              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=700&q=80"
                      alt="Dubai skyline"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 text-white">
                      <h3 className="text-lg font-semibold">
                        Dubai
                      </h3>

                      <p className="text-sm text-white/75 mt-1">
                        City escapes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">

                    <img
                      src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=700&q=80"
                      alt="Abu Dhabi"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 text-white">
                      <h3 className="text-lg font-semibold">
                        Abu Dhabi
                      </h3>

                      <p className="text-sm text-white/75 mt-1">
                        Luxury & culture
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">

                    <img
                      src="https://uaestories.com/wp-content/uploads/2025/05/spa-pool-side-S360-desktop.webp"
                      alt="Fujairah"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 text-white">
                      <h3 className="text-lg font-semibold">
                        Fujairah
                      </h3>

                      <p className="text-sm text-white/75 mt-1">
                        Coastal retreats
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">

                    <img
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80"
                      alt="Ras Al Khaimah"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 text-white">
                      <h3 className="text-lg font-semibold">
                        Ras Al Khaimah
                      </h3>

                      <p className="text-sm text-white/75 mt-1">
                        Mountain getaways
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate-100">

                    <img
                      src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80"
                      alt="Al Ain"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <div className="absolute bottom-5 left-5 text-white">
                      <h3 className="text-lg font-semibold">
                        Al Ain
                      </h3>

                      <p className="text-sm text-white/75 mt-1">
                        Peaceful escapes
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </section>

          {/* ================= GUEST REVIEWS ================= */}

          <section className="bg-slate-50 border-t border-slate-100">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

              <div className="text-center max-w-2xl mx-auto mb-10">

                <p className="text-sm font-semibold text-pine mb-2">
                  Loved by our guests
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  What guests are saying
                </h2>

                <p className="mt-3 text-base text-slate-500">
                  Experiences from guests who found their perfect stay with StayNest.
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">

                  <div className="flex gap-1 text-amber-500 text-sm">
                    ★★★★★
                  </div>

                  <p className="mt-5 text-slate-700 leading-relaxed">
                    “The villa was even better than the pictures. Everything was
                    clean, comfortable and beautifully arranged. We had such a
                    relaxing weekend.”
                  </p>

                  <div className="mt-6 flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-pine flex items-center justify-center text-white font-semibold">
                      SA
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Sarah Ahmed
                      </p>

                      <p className="text-xs text-slate-500">
                        Dubai, UAE
                      </p>
                    </div>

                  </div>

                </div>

                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">

                  <div className="flex gap-1 text-amber-500 text-sm">
                    ★★★★★
                  </div>

                  <p className="mt-5 text-slate-700 leading-relaxed">
                    “We booked a beach house in Fujairah and absolutely loved it.
                    The location was peaceful, the view was beautiful and the
                    whole booking experience was so simple.”
                  </p>

                  <div className="mt-6 flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-clay flex items-center justify-center text-white font-semibold">
                      MK
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Mohammed Khan
                      </p>

                      <p className="text-xs text-slate-500">
                        Abu Dhabi, UAE
                      </p>
                    </div>

                  </div>

                </div>

                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">

                  <div className="flex gap-1 text-amber-500 text-sm">
                    ★★★★★
                  </div>

                  <p className="mt-5 text-slate-700 leading-relaxed">
                    “StayNest made finding a weekend getaway incredibly easy.
                    The property looked exactly like the listing and the host was
                    wonderful. I would definitely book again.”
                  </p>

                  <div className="mt-6 flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-sand flex items-center justify-center text-pine font-semibold">
                      AN
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Aisha Noor
                      </p>

                      <p className="text-xs text-slate-500">
                        Sharjah, UAE
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    4.9
                  </p>

                  <p className="text-xs text-slate-500">
                    Average guest rating
                  </p>
                </div>

                <div className="hidden sm:block h-10 w-px bg-slate-200" />

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    1,200+
                  </p>

                  <p className="text-xs text-slate-500">
                    Happy guests
                  </p>
                </div>

                <div className="hidden sm:block h-10 w-px bg-slate-200" />

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    4.8/5
                  </p>

                  <p className="text-xs text-slate-500">
                    StayNest experience
                  </p>
                </div>

              </div>

            </div>

          </section>

          {/* ================= MY BOOKINGS ================= */}

          {showBookings && (
            <section id="my-bookings">
              <MyBookings
                onClose={closeBookings}
                onCancel={handleCancelBooking}
              />
            </section>
          )}

          {/* ================= BOOKING MODAL ================= */}

          {selected && (
            <ListingModal
              key={selected.id}
              listing={selected}
              onClose={async () => {
                setSelected(null)
                await loadBookings()
              }}
            />
          )}

          {/* ================= FOOTER ================= */}

          <footer className="bg-pine text-white">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">

                      <span className="text-pine font-bold text-lg">
                        S
                      </span>

                    </div>

                    <span className="text-2xl font-bold tracking-tight">
                      StayNest
                    </span>

                  </div>

                  <p className="mt-4 text-sm text-white/65 leading-relaxed max-w-xs">
                    Discover beautiful places to stay across the UAE and create
                    unforgettable moments wherever you go.
                  </p>

                </div>

                <div>

                  <h3 className="text-sm font-semibold mb-4">
                    Explore
                  </h3>

                  <div className="space-y-3 text-sm text-white/65">

                    <button className="block hover:text-white transition-colors">
                      Popular stays
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Destinations
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Beachfront homes
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Trending stays
                    </button>

                  </div>

                </div>

                <div>

                  <h3 className="text-sm font-semibold mb-4">
                    StayNest
                  </h3>

                  <div className="space-y-3 text-sm text-white/65">

                    <button className="block hover:text-white transition-colors">
                      About us
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Why StayNest?
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Become a host
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Contact us
                    </button>

                  </div>

                </div>

                <div>

                  <h3 className="text-sm font-semibold mb-4">
                    Support
                  </h3>

                  <div className="space-y-3 text-sm text-white/65">

                    <button className="block hover:text-white transition-colors">
                      Help center
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Cancellation options
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Safety information
                    </button>

                    <button className="block hover:text-white transition-colors">
                      Privacy
                    </button>

                  </div>

                </div>

              </div>

              <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

                <p className="text-xs text-white/50">
                  © 2026 StayNest. All rights reserved.
                </p>

                <div className="flex items-center gap-5 text-xs text-white/50">

                  <button className="hover:text-white transition-colors">
                    Privacy
                  </button>

                  <button className="hover:text-white transition-colors">
                    Terms
                  </button>

                  <button className="hover:text-white transition-colors">
                    Sitemap
                  </button>

                </div>

              </div>

            </div>

          </footer>
        </>
      )}

    </div>
  )
}