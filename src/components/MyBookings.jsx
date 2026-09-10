import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, Users, X } from 'lucide-react'

export default function MyBookings({ onClose, onCancel }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      const token = localStorage.getItem('staynestToken')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          'http://localhost:5000/api/bookings',
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
        console.error('Error loading bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500">
          Loading your bookings...
        </p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div
        id="my-bookings"
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <div className="text-center">
          <div className="text-5xl mb-4">🏡</div>

          <h2 className="text-2xl font-bold text-slate-900">
            No bookings yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your confirmed stays will appear here.
          </p>

          <button
            onClick={onClose}
            className="mt-6 bg-pine text-white px-6 py-3 rounded-xl font-semibold"
          >
            Explore stays
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      id="my-bookings"
      className="min-h-screen bg-slate-50 py-10"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-pine">
              Your trips
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-1">
              My Bookings
            </h1>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:shadow-md"
            aria-label="Close bookings"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">

          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">

                {/* Image */}
                <div className="h-72 md:h-full">
                  <img
                    src={booking.image}
                    alt={booking.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-6 sm:p-8">

                  <div className="inline-flex items-center rounded-full bg-pine/10 text-pine px-3 py-1.5 text-xs font-semibold">
                    ✓ Confirmed
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mt-4">
                    {booking.title}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                    <MapPin size={16} />
                    {booking.location}
                  </div>

                  <div className="mt-6 space-y-4">

                    {/* Dates */}
                    <div className="flex items-center gap-3">
                      <CalendarDays
                        size={19}
                        className="text-pine"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          DATES
                        </p>

                        <p className="text-sm font-medium text-slate-800">
                          {booking.checkIn} → {booking.checkOut}
                        </p>
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="flex items-center gap-3">
                      <Users
                        size={19}
                        className="text-pine"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          GUESTS
                        </p>

                        <p className="text-sm font-medium text-slate-800">
                          {booking.guests}{' '}
                          {booking.guests === 1
                            ? 'guest'
                            : 'guests'}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Price */}
                  <div className="mt-7 pt-6 border-t border-slate-100 flex items-center justify-between">

                    <div>
                      <p className="text-xs text-slate-400">
                        TOTAL
                      </p>

                      <p className="text-2xl font-bold text-pine mt-1">
                        AED {Number(booking.total).toLocaleString()}
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      {booking.nights}{' '}
                      {booking.nights === 1
                        ? 'night'
                        : 'nights'}
                    </p>

                  </div>

                  <button
                    onClick={() => onCancel(booking._id)}
                    className="w-full mt-6 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel booking
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}