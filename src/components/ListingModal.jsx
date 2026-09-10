import { useState } from 'react'
import { X, Star, MapPin, Minus, Plus } from 'lucide-react'

export default function ListingModal({
  listing,
  onClose,
}) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [booked, setBooked] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!listing) return null

  let nights = 0

  if (checkIn && checkOut) {
    const start = new Date(checkIn)
    const end = new Date(checkOut)

    const difference = end.getTime() - start.getTime()

    nights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )

    if (nights < 0) {
      nights = 0
    }
  }

  const extraGuests = Math.max(0, guests - 1)

  const guestFee =
    extraGuests * 300 * nights

  const accommodationTotal =
    nights * listing.price

  const total =
    accommodationTotal + guestFee

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      alert(
        'Please select your check-in and check-out dates.'
      )
      return
    }

    if (nights <= 0) {
      alert(
        'Check-out must be after check-in.'
      )
      return
    }

    const token = localStorage.getItem('staynestToken')

    if (!token) {
      alert('Please login to reserve a stay.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/bookings',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            listingId: listing.id,
            title: listing.title,
            location: listing.location,
            image: listing.image,
            price: listing.price,
            nights,
            checkIn,
            checkOut,
            guests,
            total,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message || 'Booking failed'
        )
        return
      }

      console.log(
        'Booking created:',
        data.booking
      )

      setBooked(true)

    } catch (error) {
      console.error(
        'Booking error:',
        error
      )

      alert(
        'Cannot connect to StayNest server.'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Image */}
        <div className="relative">

          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-64 object-cover rounded-t-3xl"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md"
          >
            <X size={19} />
          </button>

        </div>

        <div className="p-6">

          {/* Property information */}

          <h2 className="text-2xl font-bold text-slate-900">
            {listing.title}
          </h2>

          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
            <MapPin size={15} />
            {listing.location}
          </div>

          <div className="flex items-center gap-1.5 mt-3 text-sm">

            <Star
              size={15}
              className="fill-slate-800 text-slate-800"
            />

            <span className="font-semibold">
              {listing.rating}
            </span>

            <span className="text-slate-400">
              · Hosted by {listing.host}
            </span>

          </div>

          {/* Tags */}

          <div className="flex flex-wrap gap-2 mt-5">

            {listing.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600"
              >
                {tag}
              </span>
            ))}

          </div>

          {/* Booking details */}

          <div className="mt-7 border border-slate-200 rounded-2xl overflow-hidden">

            <div className="grid grid-cols-2 border-b border-slate-200">

              {/* Check-in */}

              <div className="p-4 border-r border-slate-200">

                <p className="text-xs font-semibold text-slate-700">
                  CHECK-IN
                </p>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value)
                    setBooked(false)
                  }}
                  className="mt-2 w-full text-sm outline-none"
                />

              </div>

              {/* Check-out */}

              <div className="p-4">

                <p className="text-xs font-semibold text-slate-700">
                  CHECK-OUT
                </p>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => {
                    setCheckOut(e.target.value)
                    setBooked(false)
                  }}
                  className="mt-2 w-full text-sm outline-none"
                />

              </div>

            </div>

            {/* Guests */}

            <div className="p-4 flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  GUESTS
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {guests}{' '}
                  {guests === 1
                    ? 'guest'
                    : 'guests'}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() => {
                    setGuests(
                      Math.max(
                        1,
                        guests - 1
                      )
                    )
                    setBooked(false)
                  }}
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center"
                >
                  <Minus size={15} />
                </button>

                <span className="w-5 text-center font-medium">
                  {guests}
                </span>

                <button
                  onClick={() => {
                    setGuests(
                      Math.min(
                        10,
                        guests + 1
                      )
                    )
                    setBooked(false)
                  }}
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center"
                >
                  <Plus size={15} />
                </button>

              </div>

            </div>

          </div>

          {/* Price */}

          <div className="mt-6">

            <div className="flex justify-between text-sm text-slate-600">

              <span>
                AED {listing.price} × {nights}{' '}
                {nights === 1
                  ? 'night'
                  : 'nights'}
              </span>

              <span>
                AED{' '}
                {accommodationTotal.toLocaleString()}
              </span>

            </div>

            {extraGuests > 0 && (

              <div className="flex justify-between mt-2 text-sm text-slate-600">

                <span>
                  Additional guests ({extraGuests})
                  {' '}× AED 300 × {nights} nights
                </span>

                <span>
                  AED{' '}
                  {guestFee.toLocaleString()}
                </span>

              </div>

            )}

            <div className="flex justify-between mt-4 pt-4 border-t border-slate-100">

              <span className="font-bold text-slate-900">
                Total
              </span>

              <span className="text-xl font-bold text-pine">
                AED {total.toLocaleString()}
              </span>

            </div>

          </div>

          {/* Reserve */}

          <button
            onClick={handleReserve}
            disabled={loading || booked}
            className="w-full mt-6 bg-clay text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading
              ? 'Booking...'
              : booked
                ? '✓ Booking confirmed'
                : 'Reserve'}
          </button>

          {/* Confirmation */}

          {booked && (

            <div className="mt-4 bg-pine/5 rounded-xl p-4 text-center">

              <p className="text-sm font-semibold text-pine">
                Your stay is confirmed! 🎉
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {nights}{' '}
                {nights === 1
                  ? 'night'
                  : 'nights'}{' '}
                · {guests}{' '}
                {guests === 1
                  ? 'guest'
                  : 'guests'}{' '}
                · AED{' '}
                {total.toLocaleString()}
              </p>

            </div>

          )}

          <p className="text-center text-xs text-slate-400 mt-4">
            You won't be charged in this demo.
          </p>

        </div>
      </div>
    </div>
  )
}